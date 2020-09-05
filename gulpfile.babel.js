/*  
    By Bill Rocha <prbr@ymail.com>

    *** Este script requer o Babel & Gulp 4 ou posterior *** 
    Antes de usar, instale a última versão do GULP-CLI e os plugins necessários:

    npm i --save-dev @babel/cli @babel/core @babel/polyfill @babel/preset-env @babel/register
    npm i --save-dev gulp@4 gulp-autoprefixer gulp-clean-css gulp-concat gulp-html-minifier2 gulp-if gulp-watch gulp-babel
    npm i --save-dev gulp-javascript-obfuscator gulp-sass gulp-uglify streamqueue uglify-es del yargs

    adicione essas linhas no seu package.js

    "babel": {
        "presets": [ "@babel/preset-env"]
    },

 */

'use strict'

import { exec, spawn } from 'child_process'
import { gulp, watch, series, parallel, src, dest } from 'gulp'
import babel from 'gulp-babel'
import gulpif from 'gulp-if'
import minifyCSS from 'gulp-clean-css'
import htmlmin from 'gulp-html-minifier2'
import concat from 'gulp-concat'
import header from 'gulp-header'
import yargs from 'yargs'
import streamqueue from 'streamqueue'
import javascriptObfuscator from 'gulp-javascript-obfuscator'
import uglifyes from 'uglify-es'
import composer from 'gulp-uglify/composer'
import imagemin from 'gulp-imagemin'
import sftp from 'gulp-sftp-up4'

const uglify = composer(uglifyes, console)
const argv = yargs.argv

// args
let PRO = argv.p !== undefined // gulp -p (production mode)
let OBF = (argv.o || false) && PRO // gulp -o (obfuscator)
let BABEL = argv.b !== undefined // gulp -b (to run Babel)

// show config
console.log(
	'\n---------------------------------------------------\n    ' +
	(!PRO ? "DEVELOPMENT mode ['gulp -p' to production]" : 'PRODUCTION mode') +
	'\n---------------------------------------------------\n'
)

// Compress HTML
const html_compress = (files, output, destination = false) =>
	src(files)
		.pipe(concat(output))
		.pipe(
			gulpif(
				PRO,
				htmlmin({
					collapseWhitespace: true,
					removeComments: true,
					removeEmptyAttributes: true
				})
			)
		)
		.pipe(dest(destination ? destination : 'public'))

// IMAGE  ------------------------------------------------------------------------------------------
const image = () =>
	src(['public/img/src/**/*'])
		.pipe(imagemin({ verbose: true }))
		.pipe(dest('public/img'))

// AUTH CREATE PASSWORD --------------------------------------------------------------------------

const html_password = () =>
	html_compress(['public/html/auth_create_password.html'], 'create_passw.ejs', 'app/auth/view')

const css_password = () =>
	streamqueue(
		{ objectMode: true },
		src([
			'public/css/src/theme/default.css',
			'public/css/src/common/reset.css',
			'public/css/src/common/form.css',
			'public/css/src/common/control.css',
			'public/css/src/common/page.css',
			'public/css/src/home.css',
			'public/css/src/auth.css'
		])
	)
		.pipe(concat('pass.css'))
		.pipe(gulpif(PRO, minifyCSS({ level: { 1: { specialComments: 0 } } })))
		.pipe(dest('public/css'))

// --- AUTH CREATE PASSWORD  - END

// HTML  ------------------------------------------------------------------------------------------
// const html_compress = (files, output, destination = false) =>
// 	src(files)
// 		.pipe(concat(output))
// 		.pipe(
// 			gulpif(
// 				PRO,
// 				htmlmin({
// 					collapseWhitespace: true,
// 					removeComments: true,
// 					removeEmptyAttributes: true
// 				})
// 			)
// 		)
// 		.pipe(dest(destination ? destination : 'app/view'))

// const html = () => {
// 	let header = `app/view/src/inc/header${PRO ? '' : '_dev'}.ejs`

// 	html_compress([header, 'app/view/src/error.ejs'], 'error.ejs')
// 	html_compress([header, 'app/view/src/no_mobile.ejs'], 'no_mobile.ejs')
// 	return html_compress([header, 'app/view/src/terms.ejs'], 't

// }

// const html_old = () => {
// 	let header = `app/view/src/inc/header${PRO ? '' : '_dev'}.ejs`

// 	html_compress([header, 'app/view/src/error.ejs'], 'error.ejs')
// 	html_compress([header, 'app/view/src/no_mobile.ejs'], 'no_mobile.ejs')
// 	return html_compress([header, 'app/view/src/terms.ejs'], 'terms.ejs')
// }

// const html_auth = () =>
// 	html_compress(
// 		[
// 			`app/view/src/auth/header${PRO ? '' : '_dev'}.ejs`,
// 			'app/view/src/auth/auth.ejs',
// 			`app/view/src/auth/footer${PRO ? '' : '_dev'}.ejs`
// 		],
// 		'auth.ejs'
// 	)

// const html_app = () =>
// 	html_compress(
// 		[
// 			`app/view/src/app/header${PRO ? '' : '_dev'}.ejs`,
// 			'app/view/src/app/app.ejs',
// 			`app/view/src/app/footer${PRO ? '' : '_dev'}.ejs`
// 		],
// 		'app.ejs'
// 	)

// const html_home = () =>
// 	html_compress(
// 		[
// 			`app/view/src/home/header${PRO ? '' : '_dev'}.ejs`,
// 			'app/view/src/home/home.ejs',
// 			`app/view/src/home/footer${PRO ? '' : '_dev'}.ejs`
// 		],
// 		'home.ejs'
// 	)

const html = () =>
	html_compress(
		[
			`public/html/inc/header${PRO ? '' : '_dev'}.html`,
			'public/html/auth.html',
			'public/html/reset.html',
			'public/html/password.html',
			'public/html/signup.html',
			'public/html/terms.html',
			'public/html/dashboard.html',
			'public/html/formulario.html',
			'public/html/service.html',
			// 'public/html/waiver.html',
			// 'public/html/money.html',
			// 'public/html/approve.html',
			// 'public/html/credit.html',
			// 'public/html/report.html',
			// 'public/html/user.html',
			`public/html/inc/footer.html`
		],
		'index.html',
		'public'
	)

// STYLE ------------------------------------------------------------------------------------------
const common = () =>
	streamqueue(
		{ objectMode: true },
		src([
			'public/css/src/theme/default.css',
			'public/css/src/common/font.css',
			'public/css/src/common/reset.css',
			'public/css/src/common/w5component.css',
			'public/css/src/common/card.css',
			'public/css/src/common/form.css',
			'public/css/src/common/control.css',
			'public/css/src/common/page.css',
			'public/css/src/common/menu.css'
		])
	)
		.pipe(concat('common.css'))
		.pipe(gulpif(PRO, minifyCSS({ level: { 1: { specialComments: 0 } } })))
		.pipe(dest('public/css'))

const css = () =>
	streamqueue(
		{ objectMode: true },
		//src(['public/src/sass/**/*.scss']).pipe(sass()),
		src([
			'public/css/src/theme.css',
			'public/css/src/style.css',
			'public/css/src/page.css',
			'public/css/src/auth.css',
			'public/css/src/home.css'
		])
	)
		.pipe(concat('a.css'))
		.pipe(gulpif(PRO, minifyCSS({ level: { 1: { specialComments: 0 } } })))
		.pipe(dest('public/css'))

// OLD STYLE - todo: revisar!!
const style = () =>
	streamqueue(
		{ objectMode: true },
		//src(['src/sass/**/*.scss']).pipe(sass()),
		src([
			'public/css/src/old_sources/lib.css',
			'node_modules/materialize-css/dist/css/materialize.min.css',
			'node_modules/cropperjs/dist/cropper.min.css',
			'public/css/src/old_sources/home.css',
			'public/css/src/old_sources/chat.css',
			'public/css/src/old_sources/message.css',
			'public/css/src/old_sources/skill.css',
			'public/css/src/old_sources/quotation.css',
			'public/css/src/old_sources/profile.css',
			'public/css/src/old_sources/config.css',
			'public/css/src/old_sources/auth.css',
			'public/css/src/old_sources/approve.css',
			'public/css/src/old_sources/w5_media.css',
			'public/css/src/old_sources/admin.css',
			'public/css/src/old_sources/commum.css'
		])
	)
		.pipe(concat('style.css'))
		.pipe(gulpif(PRO, minifyCSS({ level: { 1: { specialComments: 0 } } })))
		.pipe(dest('public/css'))

// JS VENDOR ------------------------------------------------------------------------------------------
const vendor = () =>
	src([
		'public/js/src/vendor/source/jsbn.js',
		'public/js/src/vendor/source/pbkdf2.js',
		'public/js/src/vendor/source/rsa.js',
		'public/js/src/vendor/source/aes.js',
		'public/js/src/vendor/source/aesman.js'
	])
		.pipe(gulpif(BABEL, babel()))
		.pipe(concat('v.js'))
		.pipe(gulpif(PRO, uglify()))
		.pipe(gulpif(OBF, javascriptObfuscator({ compact: true, sourceMap: false })))
		.pipe(dest('public/js'))

const vendor_aes = () =>
	src([
		'public/js/src/vendor/source/aes.js',
		'public/js/src/vendor/source/pbkdf2.js',
		'public/js/src/vendor/source/aesman.js'
	])
		.pipe(concat('va.js'))
		.pipe(gulpif(PRO, uglify()))
		.pipe(dest('public/js'))

const vendor_rsa = () =>
	src(['public/js/src/vendor/source/jsbn.js', 'public/js/src/vendor/source/rsa.js'])
		.pipe(concat('vr.js'))
		.pipe(gulpif(PRO, uglify()))
		.pipe(dest('public/js'))

// JS LIB ------------------------------------------------------------------------------------------
const prelib = cb =>
	src([
		//'public/js/src/lib/helpers.js',
		//'public/js/src/lib/sound.js',
		'public/js/src/lib/server.js',
		'public/js/src/lib/search.js',
		'public/js/src/lib/w5_media.js',
		// new
		'public/js/src/lib/function.js',
		'public/js/src/lib/util.js',
		'public/js/src/lib/lang.js',
		'public/js/src/lib/show.js'
	])
		.pipe(gulpif(BABEL, babel()))
		.pipe(concat('lib_temp.js'))
		.pipe(gulpif(PRO, uglify()))
		.pipe(gulpif(OBF, javascriptObfuscator({ compact: true, sourceMap: false })))
		.pipe(dest('public/js/src/lib'))

const lib_modules = () =>
	src([
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/socket.io-client/dist/socket.io.js',
		'node_modules/cropperjs/dist/cropper.min.js',
		'node_modules/materialize-css/dist/js/materialize.min.js'
	])
		.pipe(concat('modules.js'))
		.pipe(dest('public/js/src/lib'))

const lib = cb =>
	src(['public/js/src/lib/modules.js', 'public/js/src/lib/chart.js', 'public/js/src/lib/lib_temp.js'])
		.pipe(concat('l.js'))
		.pipe(dest('public/js'))

// AUTH  ------------------------------------------------------------------------------------------
const js_auth = () =>
	src(['public/js/src/sworker.js', 'public/js/src/auth.js'])
		.pipe(gulpif(BABEL, babel()))
		.pipe(gulpif(PRO, uglify()))
		.pipe(concat('a.js'))
		.pipe(gulpif(OBF, javascriptObfuscator({ compact: true, sourceMap: false })))
		.pipe(dest('public/js'))

// SERVICE WORKER  ------------------------------------------------------------------------------------------
const sw = () => {
	let VERSION = 'const VERSION="' + new Date().getTime() + (PRO ? '' : '-dev') + '";\r'

	let source = PRO
		? ['public/js/src/sw/file_pro.js', 'public/js/src/sw/sw.js']
		: ['public/js/src/sw/file.js', 'public/js/src/sw/sw.js']

	return src(source)
		.pipe(gulpif(BABEL, babel()))
		.pipe(concat('sw.js'))
		.pipe(header(VERSION))
		.pipe(gulpif(PRO, uglify()))
		.pipe(gulpif(OBF, javascriptObfuscator({ compact: true, sourceMap: false })))
		.pipe(dest('public'))
}

// UPLOAD TO SERVER -------------------------------------------------------------------------------------------
const deploy = (files, path, remoteRoot) => {
	console.log('Deploy:', files, ' to ', (remoteRoot || '/home/ido/www/ido/') + (path || 'public'))

	return !files || files.length < 1
		? true
		: src(files).pipe(
			sftp({
				host: 'azw5.com',
				user: 'w5adm',
				remotePath: (remoteRoot || '/home/ido/www/ido/') + (path || 'public'),
				key: 'C:\\Users\\paulo\\.ssh\\azw5_azure_rsa_private.pem'
			})
		)
}

const watcher = watch(
	[
		'public/html/**/*.html',
		// 		'public/css/src/**/*.css',
		// 		'public/js/src/**/*.js',
		//		'public/js/**/*.js'
	], { delay: 800 })

watcher.on('change', (pathx, stats) => {
	//console.log(`File ${pathx} was changed`, path.dirname(pathx).replace(/\\/g, '/') + '/' + path.basename(pathx), path.dirname(pathx).replace(/\\/g, '/'));

	html()
	setTimeout(() => deploy('public/index.html', 'public'), 200)

	//deploy(path.dirname(pathx).replace(/\\/g, '/') + '/' + path.basename(pathx), path.dirname(pathx).replace(/\\/g, '/'))
})


// Default exports
const watchDog = cb => cb()

//watcher.close()

// TASKs ----------------------------------------------------------- [TASKs]
// exports.default = parallel(js_auth, html, html_auth, html_app, html_home, css, sw)
exports.default = watchDog

// CSS
exports.css = css
exports.style = style // TODO: revisar!!

exports.common = common
exports.password = parallel(css_password, html_password)

// Htmls
// exports.html_auth = html_auth
// exports.html_app = html_app
// exports.html_home = html_home
exports.html = series(html)
// exports.htmlall = parallel(html, html_app, html_auth, html_home)

// // exports.lib_modules = libmodules

// Vendors
exports.vendor = vendor
exports.vendor_aes = vendor_aes
exports.vendor_rsa = vendor_rsa
exports.vendorall = parallel(vendor, vendor_aes, vendor_rsa)

exports.image = image
exports.sw = sw


