
source => https://ionicframework.com/docs/guide/publishing.html

$cordova build --release android
	//generates release-unsigned.apk

$keytool -genkey -v -keystore puzzle15-key-kishore.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
	//generates puzzle15-key-kishore.keystore
  // given kishore (as key)

$jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore puzzle15-key-kishore.keystore Puzzle15-release-unsigned.apk alias_name
	//sign the apk

$zipalign -v 4 Puzzle15-release-unsigned.apk Puzzle15.apk
	//generates Puzzle15.apk
