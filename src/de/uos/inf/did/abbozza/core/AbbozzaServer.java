/**
 * @license abbozza!
 *
 * Copyright 2015 Michael Brinkmeier ( michael.brinkmeier@uni-osnabrueck.de )
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
/**
 * @fileoverview The main class for the abbozza! server
 * @author michael.brinkmeier@uni-osnabrueck.de (Michael Brinkmeier)
 */
package de.uos.inf.did.abbozza.core;

import com.sun.net.httpserver.*;
import java.util.Properties;
import java.util.jar.JarFile;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.ByteArrayOutputStream;
import java.io.OutputStream;
//import java.awt.Color;
//import java.awt.Desktop;
//import java.io.BufferedReader;
//import java.io.FileReader;
//import java.io.FileWriter;
//import java.io.InputStream;
//import java.io.InputStreamReader;
import java.net.InetSocketAddress;
//import java.net.URI;
//import java.net.URISyntaxException;
//
//import javax.swing.JFileChooser;
//import javax.swing.JOptionPane;
//import javax.swing.filechooser.FileNameExtensionFilter;
//
//
//import java.awt.Component;
//import java.awt.Frame;
//import java.awt.HeadlessException;
//import java.io.ByteArrayInputStream;
//import java.util.List;
//import java.util.Vector;
//import java.util.logging.Level;
//import java.util.logging.Logger;
//import javax.swing.JDialog;
//import javax.swing.JFrame;
//import javax.xml.parsers.DocumentBuilder;
//import javax.xml.parsers.DocumentBuilderFactory;
//import javax.xml.parsers.ParserConfigurationException;
//import org.w3c.dom.Document;
//import org.w3c.dom.Node;
//import org.w3c.dom.NodeList;
//import org.xml.sax.SAXException;

public class AbbozzaServer implements HttpHandler {

//    public static final String VERSION = "0.1 (pre-alpha)";
//
    private static AbbozzaServer instance = null;
//    public static Color COLOR = new Color(91, 103, 165);
//    private static int counter;
//
//    private Editor editor;
    public ByteArrayOutputStream logger;
//    private DuplexPrintStream duplexer;
//    public String sketchbookPath;
//    public String runtimePath;
//    public AbbozzaErrMonitor errMonitor;
    private HttpServer httpServer;
    private int serverPort;
    private boolean isStarted = false;
//    private AbbozzaMonitor monitor = null;
    private Properties config = null;
    private String localDir;
    private String globalDir;

    private JarFile jarLocal;
    private JarFile jarGlobal;
    private File webDirLocal;
    private File webDirGlobal;

    private JarDirHandler jarHandler;
//
//    private File lastSketchFile = null;
//
//    // private Properties config;

    public AbbozzaServer() {
        String homeDir = System.getProperty("user.home");
        readConfig(homeDir);
        init();
    }

//    private String prefix = "/abbozza";
//
    public void init() {
        // If there is already an Abbozza instance, silently die
        if (AbbozzaServer.instance != null) {
            AbbozzaLogger.err("An abbozza! server is already running!");
            return;
        }

        // Set static instance
        AbbozzaServer.instance = this;
        AbbozzaLogger.setLevel(AbbozzaLogger.ALL);

        jarHandler = new JarDirHandler();
        findJarsAndDirs(jarHandler);

        // AbbozzaLocale.setLocale(config.getLocale());
        // AbbozzaLocale.setLocale("de_DE");
        // AbbozzaLogger.out(AbbozzaLocale.entry("msg.loaded"), AbbozzaLogger.INFO);
        this.startServer();
        //     if (config.startBrowser()) {
        //         this.startBrowser();
        //     }
        // }
    }

    public void startServer() {

        if (!isStarted) {

            this.isStarted = true;

            applyConfig(config);
            
            AbbozzaLogger.out("Starting ... ");

            // Start ErrorMonitor
            logger = new ByteArrayOutputStream();
            // duplexer = new DuplexPrintStream(logger, System.err);
            // System.setErr(duplexer);

            // errMonitor = new AbbozzaErrMonitor(logger);
            // errMonitor.start();
            while (httpServer == null) {
                try {
                    httpServer = HttpServer.create(new InetSocketAddress(serverPort), 0);
                    httpServer.createContext("/abbozza/", this /* handler */);
                    httpServer.createContext("/", jarHandler);
                    httpServer.start();
                    AbbozzaLogger.out("Http-server started on port: " + serverPort, AbbozzaLogger.INFO);
                } catch (Exception e) {
                    serverPort++;
                    httpServer = null;
                }
            }

            AbbozzaLogger.out("abbozza: " + AbbozzaLocale.entry("msg.server_started", Integer.toString(serverPort)));

            String url = "http://localhost:" + serverPort + "/index.html";
            AbbozzaLogger.out("abbozza: " + AbbozzaLocale.entry("msg.server_reachable", url));
        }

    }

    /**
     * Request handling
     *
     * @param exchg
     * @throws java.io.IOException
     */
    @Override
    public void handle(HttpExchange exchg) throws IOException {
        String path = exchg.getRequestURI().getPath();
        OutputStream os = exchg.getResponseBody();

        AbbozzaLogger.out(path + " requested");

        sendResponse(exchg, 404, "abbozza!!", "abbozza!");

//        if (!path.startsWith(prefix)) {
//            String result = AbbozzaLocale.entry("msg.not_found", path);
//
//            exchg.sendResponseHeaders(400, result.length());
//            os.write(result.getBytes());
//            os.close();
//        } else {
//            if (path.equals(prefix + "/load")) {
//                try {
//                    String sketch = loadSketch();
//                    sendResponse(exchg, 200, "text/xml", sketch);
//                } catch (IOException ioe) {
//                    sendResponse(exchg, 404, "", "");
//                }
//            } else if (path.equalsIgnoreCase(prefix + "/save")) {
//                try {
//                    saveSketch(exchg.getRequestBody());
//                    sendResponse(exchg, 200, "text/xml", "saved");
//                } catch (IOException ioe) {
//                    sendResponse(exchg, 404, "", "");
//                }
//            } else if (path.equalsIgnoreCase(prefix + "/check")) {
//                try {
//                    BufferedReader in = new BufferedReader(new InputStreamReader(exchg.getRequestBody()));
//                    StringBuffer code = new StringBuffer();
//                    while (in.ready()) {
//                        code.append(in.readLine());
//                        code.append('\n');
//                    }
//                    String response = setCode(code.toString());
//                    sendResponse(exchg, 200, "text/plain", response);
//                } catch (IOException ioe) {
//                    sendResponse(exchg, 404, "", "");
//                }
//            } else if (path.equals(prefix + "/upload")) {
//                try {
//                    BufferedReader in = new BufferedReader(new InputStreamReader(exchg.getRequestBody()));
//                    StringBuffer code = new StringBuffer();
//                    while (in.ready()) {
//                        code.append(in.readLine());
//                        code.append('\n');
//                    }
//                    String response = uploadCode(code.toString());
//                    sendResponse(exchg, 200, "text/plain", response);
//                } catch (IOException ioe) {
//                    try {
//                        sendResponse(exchg, 404, "", "");
//                    } catch (IOException ioe2) {
//                    }
//                }
//            } else if (path.equals(prefix + "/config")) {
//                sendResponse(exchg, 200, "text/plain", config.get().toString());
//            } else if (path.equalsIgnoreCase(prefix + "/frame")) {
//                Properties props = config.get();
//                AbbozzaConfigDialog dialog = new AbbozzaConfigDialog(props, null, true);
//                dialog.setAlwaysOnTop(true);
//                dialog.setModal(true);
//                dialog.toFront();
//                dialog.setVisible(true);
//                this.editor.setState(JFrame.ICONIFIED);
//                this.editor.setExtendedState(JFrame.ICONIFIED);
//                if (dialog.getState() == 0) {
//                    config.set(dialog.getConfiguration());
//                    AbbozzaLocale.setLocale(config.getLocale());
//                    AbbozzaLogger.out("closed with " + config.getLocale());
//                    config.write();
//                    sendResponse(exchg, 200, "text/plain", config.get().toString());
//                } else {
//                   sendResponse(exchg, 440, "text/plain", "");
//                }
//            } else if (path.equals(prefix + "/board")) {
//                connectToBoard(exchg);
//            } else if (path.equals(prefix + "/monitor")) {
//                if (openMonitor()) {
//                    sendResponse(exchg, 200, "text/plain", "");
//                } else {
//                    sendResponse(exchg, 440, "text/plain", "");
//                }
//            } else if (path.equals(prefix + "/monitor_resume")) {
//                if (resumeMonitor()) {
//                    sendResponse(exchg, 200, "text/plain", "");
//                } else {
//                    sendResponse(exchg, 440, "text/plain", "");
//                }
//            } else {
//                String line;
//                BufferedReader in = new BufferedReader(new InputStreamReader(exchg.getRequestBody()));
//                while (in.ready()) {
//                    line = in.readLine();
//                }
//                sendResponse(exchg, 200, "text/plain", "");
//            }
//        }
    }

    public void sendResponse(HttpExchange exchg, int code, String type, String response) throws IOException {
        byte[] buf = response.getBytes();
        OutputStream out = exchg.getResponseBody();
        Headers responseHeaders = exchg.getResponseHeaders();
        responseHeaders.set("Content-Type", type);
        exchg.sendResponseHeaders(code, buf.length);
        out.write(buf);
        out.close();
    }

//    /**
//     * 
//     * @return ctions
//     */
//    public boolean openMonitor() {
//
//        if (monitor != null) {
//            if (resumeMonitor()) {
//                monitor.toFront();
//                return true;
//            } else {
//                return false;
//            }
//        }
//
//        BoardPort port = Base.getDiscoveryManager().find(PreferencesData.get("serial.port"));
//        monitor = new AbbozzaMonitor(port);
//        try {
//            monitor.open();
//            monitor.setVisible(true);
//            monitor.toFront();
//            monitor.setAlwaysOnTop(true);
//        } catch (Exception ex) {
//            ex.printStackTrace(System.out);
//            return false;
//        }
//        return true;
//    }
//
//    public boolean resumeMonitor() {
//        if (monitor == null) {
//            return false;
//        }
//        try {
//            monitor.resume();
//        } catch (Exception ex) {
//            return false;
//        }
//        return true;
//    }
//
//    public void closeMonitor() {
//        monitor = null;
//    }
//
//    public String uploadCode(String code) {
//        // System.out.println("hier");
//
//        String response;
//        boolean flag = PreferencesData.getBoolean("editor.save_on_verify");
//        PreferencesData.setBoolean("editor.save_on_verify", false);
//
//        // System.out.println("hier 2");
//
//        editor.getSketch().getCurrentCode().setProgram(code);
//        // System.out.println("hier 3");
//        editor.getSketch().getCurrentCode().setModified(true);
//        // System.out.println("hier 4");
//        editor.setText("Test");
//        // System.out.println("hier 4.1");
//        editor.setText(code);
//        // System.out.println("hier 5");
//
//        try {
//            editor.getSketch().prepare();
//        } catch (IOException ioe) {
//            ioe.printStackTrace(System.err);
//        }
//        // System.out.println("hier 6");
//       
//        // System.out.println(editor.getSketch().getName());
//        // System.out.println(editor.getSketch().getCurrentCode().getProgram());
//
//        ThreadGroup group = Thread.currentThread().getThreadGroup();
//        Thread[] threads = new Thread[group.activeCount()];
//        group.enumerate(threads, false);
//
//        try {
//            if (monitor != null) {
//                monitor.suspend();
//            }
//
//            editor.getSketch().save();
//            editor.handleExport(false);
//        } catch (Exception ex) {
//        }
//
//        Thread[] threads2 = new Thread[group.activeCount()];
//        group.enumerate(threads2, false);
//
//        Thread last = null;
//        int j;
//        int i = threads2.length - 1;
//
//        while ((i >= 0) && (last == null)) {
//
//            j = threads.length - 1;
//            while ((j >= 0) && (threads[j] != threads2[i])) {
//                j--;
//            }
//
//            if (j < 0) {
//                last = threads2[i];
//            }
//            i--;
//        }
//        while ( (last != null) && (last.isAlive()) ) {
//        }
//
//        response = this.errMonitor.getContent();
//
//        PreferencesData.setBoolean("editor.save_on_verify", flag);
//        return response;
//    }
//
//    public String setCode(String code) {        
//        boolean flag = PreferencesData.getBoolean("editor.save_on_verify");
//        PreferencesData.setBoolean("editor.save_on_verify", false);
//
//        editor.getSketch().getCurrentCode().setProgram(code);
//        editor.getSketch().getCurrentCode().setModified(true);
//        editor.setText("Test");
//        editor.setText(code);
//        try {
//            editor.statusNotice("abbozza!: " + AbbozzaLocale.entry("msg.compiling"));
//            editor.getSketch().prepare();
//            editor.getSketch().save();
//            editor.getSketch().build(false, false);
//            editor.statusNotice("abbozza!: " + AbbozzaLocale.entry("msg.done_compiling"));
//        } catch (IOException | RunnerException | PreferencesMapException e) {
//            e.printStackTrace(System.out);
//            editor.statusError(e);
//        }
//
//        String response = this.errMonitor.getContent();
//        PreferencesData.setBoolean("editor.save_on_verify", flag);
//        return response;
//    }
//
//    public void serialMonitor() {
//        this.editor.handleSerial();
//    }
//
//    public String loadSketch() throws IOException {
//        String result = "";
//        BufferedReader reader;
//        String path = ((lastSketchFile != null) ? lastSketchFile.getAbsolutePath() : getSketchbookPath());
//        JFileChooser chooser = new JFileChooser(path) {
//            @Override
//            protected JDialog createDialog(Component parent)
//                    throws HeadlessException {
//                JDialog dialog = super.createDialog(parent);
//                // config here as needed - just to see a difference
//                dialog.setLocationByPlatform(true);
//                // might help - can't know because I can't reproduce the problem
//                dialog.setAlwaysOnTop(true);
//                return dialog;
//            }
//
//        };
//        chooser.setFileFilter(new FileNameExtensionFilter("abbozza! (*.abz)", "abz"));
//        if (chooser.showOpenDialog(null) == JFileChooser.APPROVE_OPTION) {
//            File file = chooser.getSelectedFile();
//            reader = new BufferedReader(new FileReader(file));
//            while (reader.ready()) {
//                result = result + reader.readLine() + '\n';
//            }
//            reader.close();
//            lastSketchFile = file;
//        } else {
//            throw new IOException();
//        }
//        this.editor.setState(Frame.ICONIFIED);
//        this.editor.setExtendedState(JFrame.ICONIFIED);
//        return result;
//    }
//
//    public void saveSketch(InputStream stream) throws IOException {
//        String path = ((lastSketchFile != null) ? lastSketchFile.getAbsolutePath() : getSketchbookPath());
//        JFileChooser chooser = new JFileChooser(path) {
//            @Override
//            protected JDialog createDialog(Component parent)
//                    throws HeadlessException {
//                JDialog dialog = super.createDialog(parent);
//                // config here as needed - just to see a difference
//                dialog.setLocationByPlatform(true);
//                // might help - can't know because I can't reproduce the problem
//                dialog.setAlwaysOnTop(true);
//                return dialog;
//            }
//
//        };
//        chooser.setFileFilter(new FileNameExtensionFilter("abbozza! (*.abz)", "abz"));
//        if (chooser.showSaveDialog(null) == JFileChooser.APPROVE_OPTION) {
//            File file = chooser.getSelectedFile();
//            if (!file.getName().endsWith(".abz") && !file.getName().endsWith(".ABZ")) {
//                file = new File(file.getPath() + ".abz");
//            }
//            FileWriter writer;
//
//            if (!file.equals(lastSketchFile) && file.exists()) {
//                int answer = JOptionPane.showConfirmDialog(null, AbbozzaLocale.entry("msg.file_overwrite", file.getName()), "", JOptionPane.YES_NO_OPTION);
//                if (answer == JOptionPane.NO_OPTION) {
//                    return;
//                }
//            }
//
//            writer = new FileWriter(file);
//            // StreamResult result = new StreamResult(writer);
//
//            String line;
//            BufferedReader in = new BufferedReader(new InputStreamReader(stream));
//            while (in.ready()) {
//                line = in.readLine();
//                writer.write(line);
//            }
//            writer.close();
//            in.close();
//            lastSketchFile = file;
//        }
//        this.editor.setState(JFrame.ICONIFIED);
//        this.editor.setExtendedState(JFrame.ICONIFIED);
//    }
//
//    public void startBrowser() {
//        Runtime runtime = Runtime.getRuntime();
//
//        if ((config.getBrowserPath() != null) && (!config.getBrowserPath().equals(""))) {
//            String cmd = config.getBrowserPath() + " http://localhost:" + serverPort + "/abbozza.html";
//            try {
//                AbbozzaLogger.out("Starting browser " + cmd);
//                runtime.exec(cmd);
//                editor.toBack();
//            } catch (IOException e) {
//                // TODO Browser could not be started
//            }
//        } else {
//            Object[] options = {AbbozzaLocale.entry("msg.cancel"), AbbozzaLocale.entry("msg.open_standard_browser"), AbbozzaLocale.entry("msg.give_browser")};
//            Object selected = JOptionPane.showOptionDialog(null, AbbozzaLocale.entry("msg.no_browser_given"),
//                    AbbozzaLocale.entry("msg.no_browser_given"),
//                    JOptionPane.DEFAULT_OPTION, JOptionPane.ERROR_MESSAGE,
//                    null, options, options[0]);
//            switch (selected.toString()) {
//                case "0":
//                    break;
//                case "1":
//                    boolean failed = false;
//                    if (Desktop.isDesktopSupported()) {
//                        try {
//                            Desktop desktop = Desktop.getDesktop();
//                            if (desktop.isSupported(Desktop.Action.BROWSE)) {
//                                String url = "localhost:" + serverPort + "/abbozza.html";
//                                Desktop.getDesktop().browse(new URI(url));
//                            } else {
//                                failed = true;
//                            }
//                        } catch (IOException | URISyntaxException e) {
//                            failed = true;
//                        }
//                    } else {
//                        failed = true;
//                    }
//                    if (failed) {
//                        JOptionPane.showMessageDialog(null, AbbozzaLocale.entry("msg.cant_open_standard_browser"), "abbozza!", JOptionPane.ERROR_MESSAGE);
//                    }
//                    break;
//                case "2":
//                    AbbozzaConfigDialog dialog = new AbbozzaConfigDialog(config.get(), null, true);
//                    dialog.setModal(true);
//                    dialog.setVisible(true);
//                    if (dialog.getState() == 0) {
//                        config.set(dialog.getConfiguration());
//                        AbbozzaLocale.setLocale(config.getLocale());
//                        // sendResponse(exchg, 200, "text/plain", abbozza.getProperties().toString());
//                    } else {
//                        // sendResponse(exchg, 440, "text/plain", "");
//                    }
//                    break;
//            }
//        }
//    }
//
//    public boolean connectToBoard(HttpExchange exchg) {
//        String port = null;
//        String board = null;
//        List<BoardPort> ports = Base.getDiscoveryManager().discovery();
//        for(int i = 0; i < ports.size(); i++) {
//            // System.out.println("in list " + ports.get(i).getAddress() + " " + ports.get(i).getBoardName());
//            if (ports.get(i).getBoardName() != null) {
//                port = ports.get(i).getAddress();
//                board = ports.get(i).getBoardName();
//                AbbozzaLogger.out("Found '" + board + "' on " + port);
//
//                BaseNoGui.selectSerialPort(port);
//
//                TargetPlatform platform = BaseNoGui.getTargetPlatform();
//                for (TargetBoard targetBoard : platform.getBoards().values()) {
//                    AbbozzaLogger.out(">> " + targetBoard.getName() + " == " + board);
//                    if (targetBoard.getName().equals(board)) {
//                        BaseNoGui.selectBoard(targetBoard);
//                    }
//                }
//
//                Base.INSTANCE.onBoardOrPortChange();
//                // Abbozza.getInstance().setSerialPort(port);
//            }
//        }
//
//        TargetBoard targetBoard = BaseNoGui.getTargetBoard();
//        TargetPlatform platform = BaseNoGui.getTargetPlatform();
//
//        try {
//            if (board != null) {
//                AbbozzaLogger.out("board found");
//                sendResponse(exchg, 200, "text/plain", targetBoard.getId() + "|" + targetBoard.getName() + "|" + port);
//                return true;
//            } else {
//                AbbozzaLogger.out("no board found");
//                sendResponse(exchg, 400, "text/plain", "No board found");
//                return false;
//            }
//        } catch (IOException ex) {
//            return false;
//        }
//    }
//

    public void findJarsAndDirs(JarDirHandler jarHandler) {
        webDirLocal = new File(localDir + "web/");
        if (!webDirLocal.exists()) {
            AbbozzaLogger.out(webDirLocal.getAbsolutePath() + " not found");
            webDirLocal = null;
        } else {
            AbbozzaLogger.out("Local directory: " + webDirLocal.getAbsolutePath());
        }
        webDirGlobal = new File(globalDir + "web/");
        if (!webDirGlobal.exists()) {
            AbbozzaLogger.out(webDirGlobal.getAbsolutePath() + " not found");
            webDirGlobal = null;
        } else {
            AbbozzaLogger.out("Global directory: " + webDirGlobal.getAbsolutePath());
        }
        try {
            jarLocal = new JarFile(localDir + "AbbozzaCore.jar");
            AbbozzaLogger.out("Local jar : " + jarLocal.getName());
        } catch (IOException e) {
            AbbozzaLogger.out("Local jar not found");
        }
        try {
            jarGlobal = new JarFile(globalDir + "AbbozzaCore.jar");
            AbbozzaLogger.out("Global jar : " + jarLocal.getName());
        } catch (IOException e) {
            AbbozzaLogger.out("Global Jar not found");
        }

        jarHandler.clear();
        jarHandler.addDir(webDirLocal);
        jarHandler.addJar(jarLocal);
        jarHandler.addDir(webDirGlobal);
        jarHandler.addJar(jarGlobal);
    }

//    public int getRunningServerPort() {
//        return serverPort;
//    }
    public static AbbozzaServer getInstance() {
        return instance;
    }

//    public static AbbozzaConfig getConfig() {
//        return instance.config;
//    }
//    
//    public String getSketchbookPath() {
//        return sketchbookPath;
//    }
//
//    public void print(String message) {
//        AbbozzaLogger.out(message);
//    }
//
//    public void processMessage(String message) {
//        this.editor.setText(message);
//    }
//
//    @Override
//    public String getMenuTitle() {
//        return "abbozza!";
//    }
//
//    public JarFile getJarLocal() {
//        return jarLocal;
//    }
//
//    public JarFile getJarGlobal() {
//        return jarGlobal;
//    }
//
//    public File getWebDirLocal() {
//        return webDirLocal;
//    }
//
//    public File getWebDirGlobal() {
//        return webDirGlobal;
//    }

    public byte[] getLocaleBytes(String locale) throws IOException {
        AbbozzaLogger.out("Loading locale " + locale);
        if (jarHandler != null) {
            byte[] bytes = jarHandler.getBytes("/js/abbozza/languages/" + locale + ".xml");
            if (bytes != null) {
                AbbozzaLogger.out("Loaded locale " + locale);
                return bytes;
            }
        }
        AbbozzaLogger.out("Could not find /js/abbozza/languages/" + locale + ".xml", AbbozzaLogger.ERROR);
        return null;
    }

//    public Vector getLocales() {
//        Vector locales = new Vector();
//        if (jarHandler != null) {
//            try {
//                byte[] bytes = jarHandler.getBytes("/js/languages/locales.xml");
//                if (bytes != null) {
//                    Document localeXml;
//
//                    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
//                    DocumentBuilder builder;
//                    builder = factory.newDocumentBuilder();
//                    StringBuilder xmlStringBuilder = new StringBuilder();
//                    ByteArrayInputStream input = new ByteArrayInputStream(bytes);
//                    localeXml = builder.parse(input);
//
//                    NodeList nodes = localeXml.getElementsByTagName("locale");
//                    for (int i = 0; i < nodes.getLength(); i++) {
//                        Node node = nodes.item(i);
//                        String id = node.getAttributes().getNamedItem("id").getNodeValue();
//                        String name = node.getTextContent();
//                        locales.add(new LocaleEntry(name,id));
//                    }
//
//                    AbbozzaLogger.out("Loaded list of locales");
//                }
//            } catch (IOException | SAXException  | ParserConfigurationException ex) {
//                AbbozzaLogger.out("Could not find /js/languages/locales.xml", AbbozzaLogger.ERROR);
//            }
//        }
//        return locales;        
//    }
//    
//    
//        public Document getOptionTree() {
//        Document optionsXml = null;
//        if (jarHandler != null) {
//            try {
//                byte[] bytes = jarHandler.getBytes("/js/abbozza/options.xml");
//                if (bytes != null) {
//                    DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
//                    DocumentBuilder builder;
//                    builder = factory.newDocumentBuilder();
//                    StringBuilder xmlStringBuilder = new StringBuilder();
//                    ByteArrayInputStream input = new ByteArrayInputStream(bytes);
//                    optionsXml = builder.parse(input);
//                }
//            } catch (IOException | SAXException  | ParserConfigurationException ex) {
//                AbbozzaLogger.out("Could not find /js/abbozza/options.xml", AbbozzaLogger.ERROR);
//            }
//        }
//        return optionsXml;        
//    }
    private void applyConfig(Properties config) {
        localDir = config.getProperty("localdir", System.getProperty("user.home") + "/.abbozza/");
        globalDir = config.getProperty("globaldir", "");
        serverPort = Integer.parseInt(config.getProperty("serverport", "54242"));
        AbbozzaLocale.setLocale(config.getProperty("locale","de_DE"));
    }

    private void setDefault() {
        localDir = System.getProperty("user.home") + "/.abbozza/";
        config.setProperty("localdir", localDir);
        globalDir = "";
        config.setProperty("globaldir", globalDir);
        serverPort = 54242;
        config.setProperty("serverport", Integer.toString(54242));
        config.setProperty("locale", "de_DE");
    }

    
    public void writeConfig(String configPath) {
        if (configPath == null) {
            return;
        }
        try {
            File dir = new File(configPath + "/.abbozza/");
            if (!dir.exists()) {
                dir.mkdir();
            }
            File prefFile = new File(configPath + "/.abbozza/abbozza.cfg");
            prefFile.createNewFile();
            config.store(new FileOutputStream(prefFile), "abbozza! preferences");
        } catch (IOException ex) {
            AbbozzaLogger.err("Could not write configuration file " + configPath + "/.abbozza/abbozza.cfg");
        }
    }

    public void readConfig(String configPath) {
        if (configPath == null) {
            return;
        }
        File prefFile = new File(configPath + "/.abbozza/abbozza.cfg");
        config = new Properties();
        try {
            config.load(new FileInputStream(prefFile));
        } catch (IOException ex) {
            AbbozzaLogger.err("Creating new configuration file " + configPath + "/.abbozza/abbozza.cfg");
            setDefault();
            writeConfig(configPath);
        }
        localDir = config.getProperty("localdir", System.getProperty("user.home") + "/.abbozza/");
        globalDir = config.getProperty("globaldir", "");
        serverPort = Integer.parseInt(config.getProperty("serverport", "54242"));
    }

    public static void main(String[] args) {
        AbbozzaServer server = new AbbozzaServer();
    }

}
