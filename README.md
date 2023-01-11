## Deprecated ##

This service is killed as of Jan 11, 2023 in [INFRA-7549](https://branch.atlassian.net/browse/INFRA-7549).

##See how your App is indexed with the [App Indexing Validator](https://branch.io/resources/app-indexing/)##

Currently, organic traffic is a huge source of traffic on websites, and as the mobile sphere grows, apps are trying to imitate this. App Indexing will likely become a very valuable source of traffic for developers. As such, at Branch we've had a lot of interest in determining this metric from apps and partners across the board. To name just a few benefits, app indexing can:

* promote discoverability
* enable specific content searchability and discovery
* influence site and app ratings

Whether you're a large company seeking to promote retention and content, or a small startup looking to get your exciting stuff out in the open, app indexing is definitely one of the most relevant methods. 

App indexing is essentially the mechanism by which your app’s content and activity is indexed by Google search. When Google scrapes links or content associated with your app, it gets indexed. More information on how this works (and how Branch can help!) here: https://branch.io/mobile-search/app-indexing/

This tool by Branch will help you check to see if your app and site are indexable by Google, and if your site is scrapable by Google bots. (coming soon - in a future update, we'll also check your sitemap for App links).

When you enter your site and package name/app store id, we'll test for:


1. That your site's headers contain the right tags for app indexing (these are the 'alternate' tags that refer to deep app links). We'll do this for both iOS and Android for your app (it's fine if you don't have an app on one of these platforms - the tool will give you relevant results either way). 

2. That your robots.txt exists, and that it permits scraping by Google bots (and thus allows indexing from Google). It checks that:
	1. Your robots.txt file exists.
	2. Your user-agent permissions include Googe bots.
	3. The 'allow' and 'disallow' statements in your robots.txt file give permissions to Google bots. These determine what sites are prevented or promoted to be scraped by Google. Therefore you want to make sure any of the important content you're trying to index isn't blocked.

3. That your assetlinks.json is enabled for applinks. This includes:
	1. That your assetlinks.json file is hosted at `/.well-known/assetlinks.json` and that we can retrieve it. 
	2. The package name entered is valid and exists in assetlinks.json.
	3. Server-side and client-side errors when we try to access your assetlinks.
	4. That your file's 'content type' header is valid.
	5. That your file is valid JSON.
	6. That your relation declaration validates correctly
	7. That there's a namespace for an Android app (this is a required line for Android)
	8. Check for the SHA256 fingerprints of your app’s signing certificate.

(for more info on how to set this up see https://blog.branch.io/technical-guide-to-deep-linking-android-app-links)


## Coming Soon: ##

With our next update to the tool, we'll check your sitemap for App links also.

