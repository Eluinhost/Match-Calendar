require 'json'

package = JSON.parse(IO.read('.yo-rc.json'))

app_dir = '/' + package['generator-angularjs-silex']['srcfolder']
dist_dir = '/' + package['generator-angularjs-silex']['distfolder']

sass_dir = app_dir
css_dir = '.tmp/styles'
generated_images_dir = '.tmp/images/generated'
images_dir = app_dir
javascripts_dir = app_dir
fonts_dir = app_dir + '/fonts'
http_images_path = '/'
http_generated_images_path = dist_dir + '/images/generated'
http_fonts_path = '/styles/fonts'
relative_assets = false
asset_cache_buster = false
Sass::Script::Number.precision = 10
add_import_path './bower_components'
