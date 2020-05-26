package foodcraping.Models;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;

import foodcraping.FridaFoodDataExtractor;

public class DatabaseStuff {
    private String srcPath_;
    private String url_;;
    private String user_;
    private String password_;
    
    private Connection conn;
    private FridaFoodDataExtractor fd;
    
    public DatabaseStuff(String foodsFolderPath, String srcPath, String url, String user, String password) {
        srcPath_ = srcPath;
        url_ = url;
        user_ = user;
        password_ = password;
        fd = new FridaFoodDataExtractor(foodsFolderPath);
    }
    
    public void init() {
        try {
            conn = DriverManager.getConnection(url_, user_, password_);
        } catch (SQLException e) {
            System.out.println(e.getMessage());
            System.exit(1);
        }
        fd.init();
        mapDanishToEnglish();
        
        fd.extractFoodData();
    }
    
    private List<String> getDanishFoodNames(){
        List<String> foodNames = new ArrayList<String>();
        try {
            String line;
            FileReader foodNamesFile = new FileReader(srcPath_.concat("foodcraping\\Models\\danishNameStrings.txt"));
            BufferedReader namesBR = new BufferedReader(foodNamesFile);
            while ((line = namesBR.readLine()) != null) {
                foodNames.add(line);
            }
            namesBR.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return foodNames;
    }
    
    private HashMap<String, String> rowNameMap = new HashMap<String, String>();
    private HashMap<String, String> headerNameMap = new HashMap<String, String>();
    private HashSet<String> headers = new HashSet<String>();
    
    private void mapDanishToEnglish() {
        FileReader indk = null;
        FileReader ineng = null;
        String lineDk;
        String lineEng;
        try {
            indk = new FileReader(srcPath_.concat("foodcraping\\Models\\danishRowStrings.txt"));
            ineng = new FileReader(srcPath_.concat("foodcraping\\Models\\formattedEnglishHeaderAndRowStrings"));
            BufferedReader dkbr = new BufferedReader(indk);
            BufferedReader engbr = new BufferedReader(ineng);
            
            while((lineDk = dkbr.readLine()) != null) {
                lineEng = engbr.readLine();
                
                // First element row name
                // Second element header name
                String[] dkStrs = lineDk.split(":");
                String[] engStrs = lineEng.split(":");
                rowNameMap.put(dkStrs[0], engStrs[0]);
                headerNameMap.put(dkStrs[1], engStrs[1]);
                headers.add(engStrs[1]);
            }
            
            dkbr.close();
            engbr.close();
            indk.close();
            ineng.close();
        } catch (IOException e1) {
            e1.printStackTrace();
        }
    }
    
    public void createTables() {
        if (conn == null | fd.food2DataMap.isEmpty() | headers == null) {
            System.out.println("Call init first");
            System.exit(1);
        }
        Iterator<String> itt = headers.iterator();
        
        String stmt = "CREATE TABLE %s (\r\n" + 
                "    id SERIAL PRIMARY KEY,\r\n" +
                "    food_id integer NOT NULL,\r\n" + 
                "    name VARCHAR(50) NOT NULL,\r\n" + 
                "    value float NOT NULL,\r\n" + 
                "    unit VARCHAR(10)\r\n" + 
                ");";
        
        while(itt.hasNext()) {
            String table = itt.next();
            if (!table.equals("amino_acids") &&
                !table.equals("fatty_acids_sums")) {
                System.out.println("Creating table: " + table);
                try {
                    String nstmt = String.format(stmt, table);
                    PreparedStatement pst = conn.prepareStatement(nstmt);
                    pst.execute();
                    pst.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        
        String createAminoAcidsTable = "CREATE TABLE amino_acids (\r\n" +
                "    id SERIAL PRIMARY KEY,\r\n" + 
                "    food_id integer NOT NULL,\r\n" + 
                "    name VARCHAR(50) NOT NULL,\r\n" + 
                "    value integer NOT NULL,\r\n" + 
                "    unit_mg_per_g_nitrogen float\r\n" + 
                ");";
        String createFattyAcidsTable = "CREATE TABLE fatty_acids_sums (\r\n" + 
                "    id SERIAL PRIMARY KEY,\r\n" +
                "    food_id integer NOT NULL,\r\n" + 
                "    name VARCHAR(50) NOT NULL,\r\n" + 
                "    value float NOT NULL,\r\n" + 
                "    percent_of_total float\r\n" + 
                ");";
        
        String createFoodNameTable = "CREATE TABLE foods (\r\n"
                + "    id SERIAL PRIMARY KEY,\r\n"
                + "    name_hash integer NOT NULL,\r\n"
                + "    name_dk VARCHAR(100) NOT NULL,\r\n"
                + "    name_eng VARCHAR(100)\r\n"
                + ");";
        try {
            PreparedStatement pst = conn.prepareStatement(createAminoAcidsTable);
            pst.execute();
            pst = conn.prepareStatement(createFattyAcidsTable);
            pst.execute();
            pst = conn.prepareStatement(createFoodNameTable);
            pst.execute();
            pst.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    
    public void insertRows() {
        if (conn == null | fd.food2DataMap.isEmpty() | headers == null) {
            System.out.println("Call init first");
            System.exit(1);
        }
        try {
            // Serial data type does not work dont know why.
            int id = 1;
            List<String> foodNames = getDanishFoodNames();
            //foodNames.forEach(f -> System.out.println(f));
            
            for (String food : foodNames) {
                int foodHash = food.hashCode();
                PreparedStatement pst = null;
                
                String foodsInsert = "INSERT INTO foods(id, name_hash, name_dk, name_eng) VALUES(?, ?, ?, ?);";
                
                pst = conn.prepareStatement(foodsInsert);
                pst.setInt(1, id++);
                pst.setInt(2, foodHash);
                pst.setString(3, food);
                pst.setString(4, null);
                pst.executeUpdate();
                
                Pair<String, List<Tuple4<String, String, String, String>>> data =
                        fd.food2DataMap.get(food);
                List<Tuple4<String, String, String, String>> rowData = data.getSecond();
                
                for (Tuple4<String, String, String, String> row : rowData) {
                    String table = headerNameMap.get(row.getFourth());
                    String name = row.getFirst();
                    
                    System.out.println(food + " " + row);
                    
                    String val = row.getSecond();
                    String unit = row.getThird();
                    if (val.isEmpty()) val = "0";
                    if (table.equals("amino_acids")) {
                        String insert = "INSERT INTO %s(id, food_id, name, value, unit_mg_per_g_nitrogen) VALUES(?, ?, ?, ?, ?);";
                        pst = conn.prepareStatement(String.format(insert, table));
                        pst.setInt(1, id++);
                        pst.setInt(2, foodHash);
                        pst.setString(3, name);
                        pst.setInt(4, Integer.parseInt(val));
                        if (!unit.isEmpty())
                            pst.setFloat(5, Float.parseFloat(unit));
                        else pst.setFloat(5, 0.0f);
                        pst.executeUpdate();
                    }
                    else if (table.equals("fatty_acids_sums")) {
                        String insert = "INSERT INTO %s(id, food_id, name, value, percent_of_total) VALUES(?, ?, ?, ?, ?);";
                        pst = conn.prepareStatement(String.format(insert, table));
                        pst.setInt(1, id++);
                        pst.setInt(2, foodHash);
                        pst.setString(3, name);
                        pst.setFloat(4, Float.parseFloat(val));
                        if (!unit.isEmpty())
                            pst.setFloat(5, Float.parseFloat(unit));
                        else pst.setFloat(5, -1.0f);
                        pst.executeUpdate();
                    }
                    else {
                        String insert = "INSERT INTO %s(id, food_id, name, value, unit) VALUES(?, ?, ?, ?, ?);";
                        pst = conn.prepareStatement(String.format(insert, table));
                        pst.setInt(1, id++);
                        pst.setInt(2, foodHash);
                        pst.setString(3, name);
                        pst.setFloat(4, Float.parseFloat(val));
                        if (unit == null)
                            pst.setString(5, "mg/g");
                        else pst.setString(5, unit);
                        pst.executeUpdate();
                    }
                }
                pst.close();
            }
        } catch (SQLException | NumberFormatException | NullPointerException e) {
            e.printStackTrace();
        }
    }
    
    public void dropAllTables() {
        try {
            String dropStmt = "DROP TABLE IF EXISTS %s;";
            Iterator<String> itt = headers.iterator();
            while(itt.hasNext()) {
                PreparedStatement pst = conn.prepareStatement(String.format(dropStmt, itt.next()));
                pst.execute();
                pst.close();
            }
            PreparedStatement pst = conn.prepareStatement(String.format(dropStmt, "foods"));
            pst.execute();
            pst.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    
    
}
