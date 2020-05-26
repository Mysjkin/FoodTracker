package foodcraping;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import foodcraping.Models.Pair;
import foodcraping.Models.Tuple3;
import foodcraping.Models.Tuple4;

public class FridaFoodDataExtractor extends DataExtractor {

    private Map<String, Function<Element, List<Tuple3<String, String, String>>>> theadMapToExtract;
    
    // Key: food name
    // first: food name, second: lists of headers associated with each row, third list of row with data.
    public HashMap<String, Pair<String, List<Tuple4<String, String, String, String>>>> food2DataMap =
            new HashMap<String, Pair<String, List<Tuple4<String, String, String, String>>>>();
    
    private HashSet<String> allHeaders = new HashSet<String>();
    private HashSet<String> allFoodNames = new HashSet<String>();
    
    public FridaFoodDataExtractor(String foodFolderPath) {
        super(foodFolderPath);
        theadMapToExtract = new HashMap<String, Function<Element, List<Tuple3<String, String, String>>>>();
    }

    public void init() {
        theadMapToExtract.put("Faktorer m.m.", FridaFoodDataExtractor.this::extractFactors);
        
        theadMapToExtract.put("Makronæringstoffer m.m.", FridaFoodDataExtractor.this::extractNormalTables);
        theadMapToExtract.put("Vitaminer", FridaFoodDataExtractor.this::extractNormalTables);
        theadMapToExtract.put("Mineraler og uorganisk", FridaFoodDataExtractor.this::extractNormalTables);
        theadMapToExtract.put("Organiske syrer", FridaFoodDataExtractor.this::extractNormalTables);
        theadMapToExtract.put("Kulhydrater", FridaFoodDataExtractor.this::extractNormalTables);
        theadMapToExtract.put("Steroler", FridaFoodDataExtractor.this::extractNormalTables);
        theadMapToExtract.put("Biogene aminer", FridaFoodDataExtractor.this::extractNormalTables);
        
        theadMapToExtract.put("Mættede fedtsyrer", FridaFoodDataExtractor.this::nothing);
        theadMapToExtract.put("Monoumættede fedtsyrer", FridaFoodDataExtractor.this::nothing);
        theadMapToExtract.put("Polyumættede fedtsyrer", FridaFoodDataExtractor.this::nothing);
        
        theadMapToExtract.put("Fedtsyrer, summer", FridaFoodDataExtractor.this::extractFattyAcidsSum);
        
        theadMapToExtract.put("Aminosyrer", FridaFoodDataExtractor.this::extractAminoAcids);
    }
    
    public void run() {
        System.out.println("running food data extraction...");
    }
    
    public HashSet<String> getAllFoodNames(){
        return allFoodNames;
    }
    
    public void extractFoodData() {
        List<String> files;
        Document doc;
        File file;
        try {
            Stream<Path> walk = Files.walk(Paths.get(dataPath));
            files = walk.filter(Files::isRegularFile)
                    .map(x -> x.toString()).collect(Collectors.toList());
            walk.close();
            System.out.println("Extracting data...");
            int itt = 0;
            for (String f : files) {
                if (itt++ % 5 == 0) 
                    System.out.println(String.format("Processed: %f%s", ((float)itt/(float)files.size()) * 100.0, "%"));
                file = new File(f);
                doc = Jsoup.parse(file, "UTF-8");
                String foodName = extractNames(doc).get(0);
                allFoodNames.add(foodName);
                Elements allTables = doc.getElementsByTag("table");
                List<String> headers = getAllTableHeaders(allTables);
                List<Tuple4<String, String, String, String>> rowDataAndHeader = 
                        new ArrayList<Tuple4<String, String, String, String>>();
                for (int i = 0; i < headers.size(); ++i) {
                    allHeaders.add(headers.get(i));
                    List<Tuple3<String, String, String>> rowData = Dispatcher(headers.get(i), allTables.get(i));
                    if (rowData != null) {
                        for (Tuple3<String, String, String> r : rowData) {
                            rowDataAndHeader.add(new Tuple4<String, String, String, String>(r.getFirst(), r.getSecond(), r.getThird(), headers.get(i)));
                        }
                    }
                }
                Pair<String, List<Tuple4<String, String, String, String>>> data = 
                        new Pair<String,List<Tuple4<String, String, String, String>>>(foodName, rowDataAndHeader);
                food2DataMap.put(foodName, data);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    public List<Tuple3<String, String, String>> Dispatcher(String header, Element table) {
        Function<Element, List<Tuple3<String, String, String>>> method = theadMapToExtract.get(header);
        if (method == null) {
            System.out.println("Could not find extract method for table " + header);
            System.exit(1);
        }
        try {
            return method.apply(table);
        } catch (Exception e) {
            System.out.println("Error occured for table " + header);
            e.printStackTrace();
        }
        
        return null;
    }

    public List<String> getAllTableHeaders(Elements tables){
        List<String> headerNames = new ArrayList<String>();

        for (Element table : tables) {
            // Always a single element hence we just extract element 0.
            Element headerRow = table.getElementsByTag("thead").get(0);
            Elements headers = headerRow.getElementsByTag("th");
            headerNames.add(headers.get(0).text());
            //System.out.println(headers.get(0).text());
        }

        return headerNames;
    }
    
    public Elements getTableBodyRows(Element table) {
        Element body = table.getElementsByTag("tbody").get(0);
        return body.getElementsByTag("tr");
    }
    
    private List<Tuple3<String, String, String>> extractFactors(Element table) {
        Elements rows = getTableBodyRows(table);
        List<Tuple3<String, String, String>> rowData = new ArrayList<Tuple3<String, String, String>>();
        
        for (Element r : rows) {
            Elements data = r.getElementsByTag("td");
            String dname = data.get(0).text();
            String value = data.get(1).text().replace(",", ".");
            
            rowData.add(new Tuple3<String, String, String>(dname, value, null));
            //model.setFieldFromName(dname, value, null);
        }
        return rowData;
    }

    /* Some tables can be extracted in a similar way hence
     * only one method for several tables is needed:
     *   - Macros
     *   - Vitamins
     *   - Minerals
     *   - Organic acids
     *   - Carbs */
    private List<Tuple3<String, String, String>> extractNormalTables(Element table){
        Elements rows = getTableBodyRows(table);
        List<Tuple3<String, String, String>> rowData = new ArrayList<Tuple3<String, String, String>>();
        
        for (Element r : rows) {
            Elements data = r.getElementsByTag("td");
            String dname = data.get(0).text();
            String value = data.get(1).text().replace(",", ".");
            String unit = data.get(2).text();
            
            rowData.add(new Tuple3<String, String, String>(dname, value, unit));
        }
        
        return rowData;
    }

    private List<Tuple3<String, String, String>> extractFattyAcidsSum(Element table) {
        Elements rows = getTableBodyRows(table);
        List<Tuple3<String, String, String>> rowData = new ArrayList<Tuple3<String, String, String>>();
        
        for (Element r : rows) {
            Elements data = r.getElementsByTag("td");
            String dname = data.get(0).text();
            String value = data.get(1).text().replace(",", ".");
            String unit = data.get(2).text().replace(',', '.');
            rowData.add(new Tuple3<String, String, String>(dname, value, unit));
        }
        return rowData;
    }

    private List<Tuple3<String, String, String>> extractAminoAcids(Element table) {
        Elements rows = getTableBodyRows(table);
        List<Tuple3<String, String, String>> rowData = new ArrayList<Tuple3<String, String, String>>();
        
        for (Element r : rows) {
            Elements data = r.getElementsByTag("td");
            String dname = data.get(0).text();
            String value = data.get(1).text().replace(",", ".");
            String unit = data.get(2).text().replace(",", ".");
            rowData.add(new Tuple3<String, String, String>(dname, value, unit));
        }
        return rowData;
    }

    // Used for non-interesting tables.
    private List<Tuple3<String, String, String>> nothing(Element table) {return null;}

    // Extracts food name from html doc
    // 	Index 0: Danish
    // 	Index 1: English.
    public List<String> extractNames(Document doc) {
        Elements dl = doc.getElementsByTag("dl");
        Elements names = dl.get(0).getElementsByTag("dd");
        List<String> sNames = new ArrayList<String>();;
        if (names.size() > 1) {
            sNames.add(names.get(0).text());
            sNames.add(names.get(1).text());
        }
        else {
            sNames.add(names.get(0).text());
        }

        return sNames;
    }

}
