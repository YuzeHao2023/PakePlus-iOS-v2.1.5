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

    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        let script = """
            var meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
            document.head.appendChild(meta);
        """
        let scriptInjection = WKUserScript(source: script, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
        webView.configuration.userContentController.addUserScript(scriptInjection)
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

    // 添加 Coordinator 防止缩放
    func makeCoordinator() -> Coordinator {
        Coordinator()
    }

    class Coordinator: NSObject, UIScrollViewDelegate {
        func viewForZooming(in scrollView: UIScrollView) -> UIView? {
            return nil // 返回 nil 禁止缩放
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
