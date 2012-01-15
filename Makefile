BUILD_DIR = build
RELEASE_DIR = release

RESOURCES = ${BUILD_DIR}/header.js\
			dev/jquery.bind-first.js\

LIB_VER = $(shell cat ${BUILD_DIR}/version.txt)
VER = sed "s/@VERSION/${LIB_VER}/"
DATE = $(shell date)

COMBINED = ${RELEASE_DIR}/jquery.bind-first-${LIB_VER}.js
MINIFIED = ${RELEASE_DIR}/jquery.bind-first-${LIB_VER}.min.js

combine: $(RESOURCES)
	rm -rf ${RELEASE_DIR}
	mkdir ${RELEASE_DIR}
	cat $(RESOURCES) | \
		sed 's/@DATE/'"${DATE}"'/' | \
		${VER} > $(COMBINED)

min: combine
	uglifyjs $(COMBINED) > $(MINIFIED)