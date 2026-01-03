//
//  WebView.swift
//  PakePlus
//
//  Created by Song on 2025/3/30.
//

import SwiftUI
import WebKit

struct WebView: UIViewRepresentable {
    let url: URL
    let debug = false

    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        
        // debug script
        if debug, let debugScript = WebView.loadJSFile(named: "vConsole") {
            let fullScript = debugScript + "\nvar vConsole = new window.VConsole();"
            let userScript = WKUserScript(
                source: fullScript,
                injectionTime: .atDocumentStart,
                forMainFrameOnly: true
            )
            webView.configuration.userContentController.addUserScript(userScript)
        }
        
        // disable double tap zoom
        let script = """
            var meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(meta);
        """
        let scriptInjection = WKUserScript(source: script, injectionTime: .atDocumentEnd, forMainFrameOnly: false)
        webView.configuration.userContentController.addUserScript(scriptInjection)
        
        // load custom script
        if let customScript = WebView.loadJSFile(named: "custom") {
            let userScript = WKUserScript(
                source: customScript,
                injectionTime: .atDocumentStart,
                forMainFrameOnly: false
            )
            webView.configuration.userContentController.addUserScript(userScript)
        }

        // load url
        webView.load(URLRequest(url: url))
        
        // Add gesture recognizers
        let rightSwipeGesture = UISwipeGestureRecognizer(target: context.coordinator, action: #selector(Coordinator.handleRightSwipe(_:)))
        rightSwipeGesture.direction = .right
        webView.addGestureRecognizer(rightSwipeGesture)
        
        let leftSwipeGesture = UISwipeGestureRecognizer(target: context.coordinator, action: #selector(Coordinator.handleLeftSwipe(_:)))
        leftSwipeGesture.direction = .left
        webView.addGestureRecognizer(leftSwipeGesture)
        
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {
        let request = URLRequest(url: url)
        print("updateUIView: \(request.url?.absoluteString ?? "")")
        uiView.load(request)
    }

    // add coordinator to prevent zoom
    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    class Coordinator: NSObject, UIScrollViewDelegate {
        func viewForZooming(in scrollView: UIScrollView) -> UIView? {
            // disable zoom
            return nil
        }
        
        @objc func handleRightSwipe(_ gesture: UISwipeGestureRecognizer) {
            if let webView = gesture.view as? WKWebView, webView.canGoBack {
                webView.goBack()
            }
        }
        
        @objc func handleLeftSwipe(_ gesture: UISwipeGestureRecognizer) {
            if let webView = gesture.view as? WKWebView, webView.canGoForward {
                webView.goForward()
            }
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            print("didFinish navigation: \(String(describing: webView.url))")
            // currentURL = webView.url
        }
    }
}


extension WebView {
    static func loadJSFile(named filename: String) -> String? {
        guard let path = Bundle.main.path(forResource: filename, ofType: "js") else {
            print("Could not find \(filename).js in bundle")
            return nil
        }
        
        do {
            let jsString = try String(contentsOfFile: path, encoding: .utf8)
            return jsString
        } catch {
            print("Error loading \(filename).js: \(error)")
            return nil
        }
    }
}
