const { execSync } = require('child_process')
const fs = require('fs-extra')
const path = require('path')
const ppconfig = require('./ppconfig.json')

const updateAppName = async (appName) => {
    // workerflow build app showName
    try {
        const plistPath = path.join(__dirname, '../PakePlus/Info.plist')
        execSync(
            `plutil -replace CFBundleDisplayName -string "${appName}" "${plistPath}"`
        )
        // const projectPbxprojPath = path.join(
        //     __dirname,
        //     '../PakePlus.xcodeproj/project.pbxproj'
        // )
        // let content = await fs.readFile(projectPbxprojPath, 'utf8')
        // content = content.replace(
        //     /INFOPLIST_KEY_CFBundleDisplayName = (.*?);/g,
        //     `INFOPLIST_KEY_CFBundleDisplayName = ${appName};`
        // )
        // await fs.writeFile(projectPbxprojPath, content)
        console.log(`✅ Updated app_name to: ${appName}`)
    } catch (error) {
        console.error('❌ Error updating app name:', error)
    }
}

const updateWebUrl = async (webUrl, safeArea) => {
    try {
        // Assuming ContentView.swift
        const contentViewPath = path.join(
            __dirname,
            '../PakePlus/ContentView.swift'
        )
        let content = await fs.readFile(contentViewPath, 'utf8')
        content = content.replace(
            /WebView\(url: URL\(string: ".*?"\)!\)/,
            `WebView(url: URL(string: "${webUrl}")!)`
        )
        if (safeArea === 'all') {
            console.log('safeArea is all')
        } else if (safeArea === 'top') {
            console.log('safeArea is top')
            content = content.replace(
                /edges: \[\]/,
                `edges: [.leading, .trailing, .bottom]`
            )
        } else if (safeArea === 'bottom') {
            console.log('safeArea is bottom')
            content = content.replace(
                /edges: \[\]/,
                `edges: [.top, .leading, .trailing]`
            )
        } else if (safeArea === 'left') {
            console.log('safeArea is left')
            content = content.replace(
                /edges: \[\]/,
                `edges: [.top, .trailing, .bottom]`
            )
        } else if (safeArea === 'right') {
            console.log('safeArea is right')
            content = content.replace(
                /edges: \[\]/,
                `edges: [.top, .leading, .bottom]`
            )
        } else if (safeArea === 'horizontal') {
            console.log('safeArea is horizontal')
            content = content.replace(/edges: \[\]/, `edges: [.top, .bottom]`)
        } else if (safeArea === 'vertical') {
            console.log('safeArea is vertical')
            content = content.replace(
                /edges: \[\]/,
                `edges: [.leading, .trailing]`
            )
        }
        await fs.writeFile(contentViewPath, content)
        console.log(`✅ Updated web URL to: ${webUrl}`)
    } catch (error) {
        console.error('❌ Error updating web URL:', error)
    }
}

const updateWebEnv = async (debug, webview) => {
    // update debug
    const webViewPath = path.join(__dirname, '../PakePlus/WebView.swift')
    let content = await fs.readFile(webViewPath, 'utf8')
    content = content.replace(/let debug = false/, `let debug = ${debug}`)

    // update userAgent
    const { userAgent } = webview
    if (userAgent) {
        content = content.replace(
            `// webView.customUserAgent = ""`,
            `webView.customUserAgent = "${userAgent}"`
        )
    }

    await fs.writeFile(webViewPath, content)
    console.log(`✅ Updated debug to: ${debug}`)
}

// set github env
const setGithubEnv = (name, version, pubBody) => {
    console.log('setGithubEnv......')
    const envPath = process.env.GITHUB_ENV
    if (!envPath) {
        console.error('GITHUB_ENV is not defined')
        return
    }
    try {
        const entries = {
            NAME: name,
            VERSION: version,
            PUBBODY: pubBody,
        }
        for (const [key, value] of Object.entries(entries)) {
            if (value !== undefined) {
                fs.appendFileSync(envPath, `${key}=${value}\n`)
            }
        }
        console.log('✅ Environment variables written to GITHUB_ENV')
        console.log(fs.readFileSync(envPath, 'utf-8'))
    } catch (err) {
        console.error('❌ Failed to parse config or write to GITHUB_ENV:', err)
    }
    console.log('setGithubEnv success')
}

// update android applicationId
const updateBundleId = async (newBundleId) => {
    // Write back only if changes were made
    const pbxprojPath = path.join(
        __dirname,
        '../PakePlus.xcodeproj/project.pbxproj'
    )
    try {
        console.log(`Updating Bundle ID to ${newBundleId}...`)
        let content = fs.readFileSync(pbxprojPath, 'utf8')
        content = content.replaceAll(
            /PRODUCT_BUNDLE_IDENTIFIER = (.*?);/g,
            `PRODUCT_BUNDLE_IDENTIFIER = ${newBundleId};`
        )
        fs.writeFileSync(pbxprojPath, content)
        console.log(`✅ Updated Bundle ID to: ${newBundleId} success`)
    } catch (error) {
        console.error('Error updating Bundle ID:', error)
    }
}

const main = async () => {
    const { webview } = ppconfig.phone
    const { name, showName, version, webUrl, id, pubBody, debug, safeArea } =
        ppconfig.ios

    // Update app name if provided
    await updateAppName(showName)

    // Update web URL if provided
    await updateWebUrl(webUrl, safeArea)

    // update debug
    await updateWebEnv(debug, webview)

    // update android applicationId
    await updateBundleId(id)

    // set github env
    setGithubEnv(name, version, pubBody)

    // success
    console.log('✅ Worker Success')
}

// run
;(async () => {
    try {
        console.log('🚀 worker start')
        await main()
        console.log('🚀 worker end')
    } catch (error) {
        console.error('❌ Worker Error:', error)
    }
})()
