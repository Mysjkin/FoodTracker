package foodcraping;

import org.json.JSONException;
import org.json.JSONObject;

import foodcraping.Models.DatabaseStuff;
import foodcraping.Models.ModelBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class Main {
	public static void main(String args[]) {
		
		if (args.length != 1) {
			System.out.println("config file location not specified in program arguments");
		}
		
		org.json.JSONObject obj;
		String foodsFolderPath = null;
		String srcPath = null;
		String dburl = null;
		String dbusername = null;
		String dbpassword = null;
		try {
			String configFile = Files.readString(Paths.get(args[0]));
			obj = new JSONObject(configFile);
			foodsFolderPath = obj.getString("folderPath");
			srcPath = obj.getString("srcPath");
			dburl = obj.getString("dburl");
			dbusername = obj.getString("dbuser");
			dbpassword = obj.getString("dbpassword");
		} catch (JSONException | IOException e) {
			e.printStackTrace();
		}
		 
		System.out.println("Starting foodcraping...");
		
		if (foodsFolderPath == null || srcPath == null) System.exit(1);
		else System.out.println(foodsFolderPath);
		
		//ModelBuilder mb = new ModelBuilder(foodsFolderPath, srcPath);
		//mb.createDanishRowNameFile();
		//mb.formatEnglishRowNames();
		//DatabaseStuff dbs = new DatabaseStuff(foodsFolderPath, srcPath, dburl, dbusername, dbpassword);
		//dbs.init();
		//dbs.createTables();
		//dbs.insertRows();
		//dbs.dropAllTables();
		
		
		//DataExtractor de = new FridaFoodDataExtractor(folderPath);
		//de.init();
		//de.run();
		
		//FridaScraper fs = new FridaScraper(folderPath);
		//fs.run();
	}
}
