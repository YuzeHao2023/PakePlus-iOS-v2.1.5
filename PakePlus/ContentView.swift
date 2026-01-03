//
//  ContentView.swift
//  PakePlus
//
//  Created by Song on 2025/3/29.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        // BottomMenuView()
        ZStack {
            // background color
            // Color.white
            //     .ignoresSafeArea()
            // webview
            WebView(url: URL(string: "https://juejin.cn/")!)
                .ignoresSafeArea(edges: [])
        }
    }
}

#Preview {
    ContentView()
}
