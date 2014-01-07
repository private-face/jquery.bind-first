BUILD_DIR = build
RELEASE_DIR = release

RESOURCES = ${BUILD_DIR}/header.js\
			dev/jquery.bind-first.js\

LIB_VER = $(shell node -e "console.log(JSON.parse(require('fs').readFileSync('bind-first.jquery.json').toString()).version);")
DATE = $(shell date)

COMBINED = ${RELEASE_DIR}/jquery.bind-first-${LIB_VER}.js
MINIFIED = ${RELEASE_DIR}/jquery.bind-first-${LIB_VER}.min.js

combine: $(RESOURCES)
	rm -rf ${RELEASE_DIR}
	mkdir ${RELEASE_DIR}
	cat $(RESOURCES) | \
		sed 's/@DATE/'"${DATE}"'/' | \
		sed 's/@VERSION/${LIB_VER}/' > $(COMBINED)
	# sed -e's/jquery\.bind-first-.*\.min+/jquery.bind-first-${LIB_VER}\.min/' examples/index.html

min: combine
	uglifyjs2 $(COMBINED) --compress --mangle --comments --output $(MINIFIED)