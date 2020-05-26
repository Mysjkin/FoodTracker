package foodcraping.Models;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;

import foodcraping.FridaFoodDataExtractor;

public class ModelBuilder {
    private String foodsPath_;
    private String srcPath_;
    
    private StringBuilder factors = new StringBuilder();
    private StringBuilder macros = new StringBuilder();
    private StringBuilder vitamins = new StringBuilder();
    private StringBuilder minerals = new StringBuilder();
    private StringBuilder organicAcids = new StringBuilder();
    private StringBuilder carbs = new StringBuilder();
    private StringBuilder fattyAcids = new StringBuilder();
    private StringBuilder sterols = new StringBuilder();
    private StringBuilder aminoAcids = new StringBuilder();
    private StringBuilder biogenic_amines = new StringBuilder();
    
    private List<String> supportedHeaderLst = new ArrayList<String>(
            Arrays.asList("Faktorer m.m.", "Makronæringstoffer m.m.", "Vitaminer",
                           "Mineraler og uorganisk", "Organiske syrer", "Kulhydrater", 
                           "Fedtsyrer, summer", "Steroler", "Aminosyrer", "Biogene aminer"));
    
    private HashMap<String, StringBuilder> headerToStringBuilderMap;
    
    private List<String> formattedRowNames = new ArrayList<String>();
    private List<String> formattedHeaders = new ArrayList<String>();
    private HashSet<String> tables = new HashSet<String>();
    
    public ModelBuilder(String foodsPath, String srcPath) {
        foodsPath_ = foodsPath;
        srcPath_ = srcPath;
        headerToStringBuilderMap = new HashMap<String, StringBuilder>();
        headerToStringBuilderMap.put("Faktorer m.m.", factors);
        headerToStringBuilderMap.put("Makronæringstoffer m.m.", macros);
        headerToStringBuilderMap.put("Vitaminer", vitamins);
        headerToStringBuilderMap.put("Mineraler og uorganisk", minerals);
        headerToStringBuilderMap.put("Organiske syrer", organicAcids);
        headerToStringBuilderMap.put("Kulhydrater", carbs);
        headerToStringBuilderMap.put("Fedtsyrer, summer", fattyAcids);
        headerToStringBuilderMap.put("Steroler", sterols);
        headerToStringBuilderMap.put("Aminosyrer", aminoAcids);
        headerToStringBuilderMap.put("Biogene aminer", biogenic_amines);
        fd = new FridaFoodDataExtractor(foodsPath_);
    }
    
    private FridaFoodDataExtractor fd;
    
    public void fillStringBuilders() {
        HashSet<String> includedRowNames = new HashSet<String>();
        fd.init();
        fd.extractFoodData();
        
        Iterator<String> ittr = fd.getAllFoodNames().iterator();
        while (ittr.hasNext()) {
            String food = ittr.next();
            Pair<String, List<Tuple4<String, String, String, String>>> data =
                    fd.food2DataMap.get(food);
            List<Tuple4<String, String, String, String>> rowData = data.getSecond();
            for (var r : rowData) {
                if (!includedRowNames.contains(r.getFirst())) {
                    StringBuilder sb = headerToStringBuilderMap.get(r.getFourth());
                    sb.append(r.getFirst() + ":" + r.getFourth() + "\r\n");
                    includedRowNames.add(r.getFirst());
                }
            }
        }
    }
    
    public void createDanishRowNameFile() {
        System.out.println("Creating field translation file");
        FileWriter out = null;
        FileWriter names = null;
        fillStringBuilders();
        try {
            out = new FileWriter(srcPath_.concat("foodcraping\\Models\\danishRowStrings.txt"));
            names = new FileWriter(srcPath_.concat("foodcraping\\Models\\danishNameStrings.txt"));
            StringBuilder rowStringFile = new StringBuilder();
            StringBuilder foodNamesFile = new StringBuilder();
            for (String s : supportedHeaderLst) {
                rowStringFile.append(headerToStringBuilderMap.get(s));
            }
            Iterator<String> ittr = fd.getAllFoodNames().iterator();
            while (ittr.hasNext()) {
                String n = ittr.next();
                foodNamesFile.append(n + "\r\n");
            }
            
            out.write(rowStringFile.toString());
            names.write(foodNamesFile.toString());
            out.close();
            names.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
     
    // Removes unwanted chars such as spaces, -, etc and converts letters to lower case.
    public void formatEnglishRowNames() {        
        FileReader in = null;
        FileWriter out = null;
        StringBuilder str = new StringBuilder();
        String line;
        try {
            in = new FileReader(srcPath_.concat("foodcraping\\Models\\englishRowStrings"));
            out = new FileWriter(srcPath_.concat("foodcraping\\Models\\formattedEnglishHeaderAndRowStrings"));
            BufferedReader br = new BufferedReader(in);
            while((line = br.readLine()) != null) {
                String[] l1 = line.split(":");
                String row = l1[0];
                String header = l1[1].substring(1);
                
                row = row.replaceAll(",", "")
                         .replace(' ', '_')
                         .replace('-', '_')
                         .toLowerCase();
                
                header = header.replaceAll(",", "")
                               .replaceAll(" etc.", "")
                               .replace(' ', '_')
                               .toLowerCase();
                
                formattedRowNames.add(row);
                formattedHeaders.add(header);
                str.append(String.format("%s:%s\r\n", row, header));
                if (!tables.contains(header)) {
                    tables.add(header);
                }
            }
            out.append(str);
            out.close();
            in.close();
            br.close();
        } catch (IOException e1) {
            e1.printStackTrace();
        }
    }
}
