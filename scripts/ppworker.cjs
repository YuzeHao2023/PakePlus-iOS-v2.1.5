const { execSync } = require('child_process')
const fs = require('fs-extra')
const plist = require('plist')
const path = require('path')
const ppconfig = require('./ppconfig.json')

const updateAppName = async (appName) => {
    // workerflow build app showName
    try {
        const plistPath = path.join(__dirname, '../PakePlus/Info.plist')
        execSync(
            `plutil -replace CFBundleDisplayName -string "${appName}" "${plistPath}"`
        )
        // await fs.writeFile(projectPbxprojPath, content)
        console.log(`✅ Updated app_name to: ${appName}`)
    } catch (error) {
        console.error('❌ Error updating app name:', error)
    }
}

// update ContentView.swift
const updateContentView = async (safeArea) => {
    try {
        // Assuming ContentView.swift
        const contentViewPath = path.join(
            __dirname,
            '../PakePlus/ContentView.swift'
        )
        let content = await fs.readFile(contentViewPath, 'utf8')
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
        console.log(`✅ Updated safeArea to: ${safeArea}`)
    } catch (error) {
        console.error('❌ Error updating safeArea:', error)
    }
}

const updateWebEnv = async (webview) => {
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
const setGithubEnv = (name, version, pubBody, isHtml) => {
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
            ISHTML: isHtml,
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

// parse Info.plist and update Info.plist
const updateInfoPlist = async (
    showName,
    debug,
    webUrl,
    isHtml,
    safeArea,
    userAgent
) => {
    const infoPlistPath = path.join(__dirname, '../PakePlus/Info.plist')
    const infoPlist = fs.readFileSync(infoPlistPath, 'utf8')
    const infoPlistData = plist.parse(infoPlist)
    // update showName
    infoPlistData.CFBundleDisplayName = showName
    // is html
    if (isHtml) {
        infoPlistData.WEBURL = 'https://www.pakeplus.com/'
    } else {
        infoPlistData.WEBURL = webUrl
        // remove index.html
        fs.unlinkSync(path.join(__dirname, '../PakePlus/index.html'))
    }
    // update debug
    if (debug) {
        infoPlistData.DEBUG = debug
    } else {
        // remove vConsole.js
        fs.unlinkSync(path.join(__dirname, '../PakePlus/vConsole.js'))
    }
    // update userAgent
    if (userAgent) {
        infoPlistData.USERAGENT = userAgent
    } else {
        infoPlistData.USERAGENT = ''
    }
    // update fullScreen
    if (safeArea === 'fullscreen') {
        infoPlistData.FULLSCREEN = true
    } else {
        infoPlistData.FULLSCREEN = false
    }
    // log
    console.log('new infoPlist: ', infoPlistData)
    fs.writeFileSync(infoPlistPath, plist.build(infoPlistData))
}

const main = async () => {
    const { webview } = ppconfig.phone
    const {
        name,
        showName,
        version,
        webUrl,
        id,
        pubBody,
        debug,
        safeArea,
        isHtml,
    } = ppconfig.ios

    // Update app name if provided
    // await updateAppName(showName)

    // Update web URL if provided
    await updateContentView(safeArea)

    // update debug
    // await updateWebEnv(webview)

    // update android applicationId
    await updateBundleId(id)

    // set github env
    setGithubEnv(name, version, pubBody, isHtml)

    // parse Info.plist and update baseUrl
    const userAgent = webview.userAgent
    await updateInfoPlist(showName, debug, webUrl, isHtml, safeArea, userAgent)

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
