package foodcraping;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.HashSet;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;

abstract public class BasicScraper {
	
	protected HashSet<String> links;
	
	public BasicScraper(String folderPath) {
		links = new HashSet<String>();
	}
	
	abstract public void run();
	
	protected Elements getPageLinks(String url, String selector) {
		try {
			InputStream inStream = new URL(url).openStream();
			Document doc = Jsoup.parse(inStream, "ISO-8859-1", url);
			Elements els = doc.select(String.format("a[href~=%s]", selector));
			
			return els;
			
		} catch (IOException e) {
			System.err.println(url + ": " + e.getMessage());
		}
		return null;
	}
}
