package foodcraping;

abstract public class DataExtractor {
	protected String dataPath;
	
	abstract public void init();
	
	public DataExtractor(String dataFolderPath) {
		dataPath = dataFolderPath;
	}
	
	abstract public void run();
}
