//
//  ContentView.swift
//  PakePlus
//
//  Created by Song on 2025/3/29.
//

import SwiftUI

struct ContentView: View {
    // read value from info
    let webUrl = Bundle.main.object(forInfoDictionaryKey: "WEBURL") as? String ?? ""
    let debug = Bundle.main.object(forInfoDictionaryKey: "DEBUG") as? Bool ?? false
    let fullScreen = Bundle.main.object(forInfoDictionaryKey: "FULLSCREEN") as? Bool ?? false

    var body: some View {
        // BottomMenuView()
        ZStack {
            // background color
            // Color.white
            //     .ignoresSafeArea()
            // webview
            WebView(webUrl: URL(string: webUrl)!, debug: debug)
                .ignoresSafeArea(edges: [.all])
        }.statusBarHidden(fullScreen)
    }
}

// #Preview {
//     ContentView()
// }
