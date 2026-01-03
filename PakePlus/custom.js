const removeSel = (selector) => {
    const ele = document.querySelector(selector)
    if (ele) {
        console.log(`Removing element: ${selector}`)
        ele.style.display = 'none'
    } else {
        console.log(`Element not found for selector: ${selector}`)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed')
    const observer = new MutationObserver(() => {
        removeSel('.title-wrap')
        removeSel('.rule-btn-wrap')
        removeSel('.gd-desc')
        removeSel('.myapp')
        removeSel('body > uni-app > uni-page > uni-page-wrapper > uni-page-body > uni-view > uni-view.page-wrap-bd > uni-view:nth-child(4)')
        removeSel('body > uni-app > uni-page > uni-page-wrapper > uni-page-body > uni-view > uni-view.home-page > uni-view.home-body > uni-view.cate-wrap > uni-view:nth-child(4)')
        removeSel('body > uni-app > uni-page > uni-page-wrapper > uni-page-body > uni-view > uni-view.home-page > uni-view.home-body > uni-view.cate-wrap > uni-view:nth-child(5)')
        removeSel('body > uni-app > uni-page > uni-page-wrapper > uni-page-body > uni-view > uni-view.home-page > uni-view.home-body > uni-view.cate-wrap > uni-view:nth-child(6)')
        if(document.querySelector(".coupon")){
            document.querySelector(".coupon").style.height = "100vh"
        }
        if(document.querySelector(".page-wrap")){
            document.querySelector(".page-wrap").style.height = "100vh"
        }
    })

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    })
    // Example: Remove elements with class 'ad-banner' and id 'popup'
    removeSel('body > uni-app > uni-tabbar > div.uni-tabbar > div:nth-child(3)')
    removeSel('body > uni-app > uni-tabbar > div.uni-tabbar > div:nth-child(4)')
})
