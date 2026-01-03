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
        WebView(url: URL(string: "https://www.baidu.com")!)
            .ignoresSafeArea()
    }
}

#Preview {
    ContentView()
}
