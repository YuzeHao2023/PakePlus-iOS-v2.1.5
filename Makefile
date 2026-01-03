ARCHS := arm64
#12.2 就是最低系统版本，这个没啥用，Xcode项目按照Xcode项目为准
TARGET := iphone:clang:latest:12.2

include $(THEOS)/makefiles/common.mk

# 使用 Xcode 项目构建
XCODEPROJ_NAME = PakePlus

# 指定 Theos 使用 xcodeproj 规则
include $(THEOS_MAKE_PATH)/xcodeproj.mk

# 在打包阶段删除_CodeSignature
before-package::
	@echo -e "\033[32mRemoving _CodeSignature folder..."
	@rm -rf $(THEOS_STAGING_DIR)/Applications/$(XCODEPROJ_NAME).app/_CodeSignature
