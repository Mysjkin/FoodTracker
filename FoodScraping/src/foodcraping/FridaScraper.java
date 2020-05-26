package foodcraping;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.io.FileWriter;

import java.util.*;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingDeque;

public class FridaScraper extends BasicScraper{
	private String folderLocation;
	
	private BlockingQueue<Element> allUrlExtractionQueue;
    private BlockingQueue<Element> foodUrlExtractionQueue;
    private BlockingQueue<String> foodLinkQueue;
    
    private HashSet<String> foodPageUrls;
    private HashSet<String> foodUrls;
    
    private ExecutorService executor;
	
	final private String siteUrl = "https://frida.fooddata.dk/food/lists/alphabetic/";
	
	// Url for heading A is weird.
	final private String aHeadingUrlPage1 = "https://frida.fooddata.dk/food/lists/alphabetic?page=1#headingA";
	final private String aHeadingUrlPage2 = "https://frida.fooddata.dk/food/lists/alphabetic?page=2#headingA";
	// Other link selector extracts food list pages.
	//String otherLinkSelector = "^https://frida.fooddata.dk/food/lists/alphabetic/[a-z]\\?[#]heading[A-Z]";
	final private String otherLinkSelector = "^https://frida.fooddata.dk/food/lists/alphabetic/";
	// Food link selector extracts individual food pages.
	final private String foodLinkSelector = "^https://frida.fooddata.dk/food/[0-9]+\\?";
	
	public FridaScraper(String folderPath){
		super(folderPath);
		
		foodPageUrls = new HashSet<String>();
		foodUrls = new HashSet<String>();
		
		executor = Executors.newFixedThreadPool(3);
		
		allUrlExtractionQueue = new LinkedBlockingDeque<Element>();
		foodUrlExtractionQueue = new LinkedBlockingDeque<Element>();
		foodLinkQueue = new LinkedBlockingDeque<String>();
		
		folderLocation = folderPath;
		Elements urlList = getPageLinks(siteUrl, otherLinkSelector);
		for (Element u : urlList) {
			allUrlExtractionQueue.add(u);
		}
		
		Element A1 = new Element("a");
		A1.attr("href", aHeadingUrlPage1);
		foodUrlExtractionQueue.add(A1);
		
		Element A2 = new Element("a");
		A2.attr("href", aHeadingUrlPage2);
		foodUrlExtractionQueue.add(A2);
	}
	
	int iterations = 0;
	int maxittr = 10000;
	
	private Runnable getPageUrlsTask() {
		Runnable task = () -> { 
			try {
				while (true) {
					String url = allUrlExtractionQueue.take().attr("abs:href");
					if (!links.contains(url)) {
						Elements urls = getPageLinks(url, otherLinkSelector);
						System.out.println("getPageUrlsTask: " + url);
						links.add(url);
						for (Element urlLink : urls) {
							allUrlExtractionQueue.add(urlLink);
							foodUrlExtractionQueue.add(urlLink);
						}
					}
					Thread.sleep(3000);
					if (iterations++ > maxittr) break;
				}
			} catch (InterruptedException e) {
                e.printStackTrace();
            }
		};
		return task;
	}
	
	private Runnable getFoodUrlsTask() {
		Runnable task = () -> { 
			try {
				while (true) {
					String foodUrl = foodUrlExtractionQueue.take().attr("abs:href");
					if (!foodPageUrls.contains(foodUrl)) {
						Elements foods = getPageLinks(foodUrl, foodLinkSelector);
						foodPageUrls.add(foodUrl);
						if (!foods.isEmpty()) {
							System.out.println("getFoodUrlsTask: " + foodUrl);
							for (Element foodElement : foods) {
								String foodElementUrl = foodElement.attr("abs:href");
								foodLinkQueue.add(foodElementUrl);
							}
						}
						Thread.sleep(1500);
					}
					else {
						System.out.println("not unique food url: " + foodUrl);
					}
					if (iterations++ > maxittr) break;
				}
			} catch (InterruptedException e) {
                e.printStackTrace();
            }
		};
		return task;
	}
	
	private Runnable extractHtmlBodyTask() {
		Runnable task = () -> { 
			try {
				int foodIndex = 0;				
				while (true) {
					String foodLink = foodLinkQueue.take();
					if (!foodUrls.contains(foodLink)) {
						foodUrls.add(foodLink);
						foodIndex++;
						try {
							Document doc = Jsoup.connect(foodLink).get();
							FileWriter out = new FileWriter(folderLocation + "food" + foodIndex + ".txt");
							out.write(doc.body().html());
							out.close();
							System.out.println("extractHtmlBodyTask:" + foodLink);
							Thread.sleep(1500);
							
						} catch (IOException | InterruptedException e) {
							System.err.println(foodLink + ": " + e.getMessage());
						}
					}
					else {
						System.out.println("not unique food link: " + foodLink);
					}
					if (iterations++ >= maxittr) break;
				}
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		};
		return task;
	}
	
	public void run(){
		Runnable getPageUrlsTask_ = getPageUrlsTask();
		Runnable getFoodUrlsTask_ = getFoodUrlsTask();
		Runnable extractHtmlBodyTask_ = extractHtmlBodyTask();
		
		executor.execute(getPageUrlsTask_);
		executor.execute(getFoodUrlsTask_);
		executor.execute(extractHtmlBodyTask_);
		
		executor.shutdown();
	}
	
}
