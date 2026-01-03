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
            // 红色背景（覆盖整个屏幕）
            Color.white
                .ignoresSafeArea()
            // 你的主要内容
            WebView(url: URL(string: "https://juejin.cn/")!)
        }
    }
}

#Preview {
    ContentView()
}
