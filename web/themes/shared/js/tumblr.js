// JSON-P Tumblr fetcher
// (c) Andrew Gruner // MIT License

var tumblr = (function($) {

    var defaultOptions = {
        tumblrFeedId: 'tumblr_posts',
        headerTag: 'h4',
        tumblrPostClass: 'tumblr_post',
        count: 8
    };

    function showTumblrFeed(tumblrData, options) {
        var tumblrPosts = document.createDocumentFragment();

        for (var j = 0; j < tumblrData.posts.length; j++) {

            var post = tumblrData.posts[j],
                postFragment = document.createElement('div');

                postFragment.setAttribute('class', options.tumblrPostClass);

            if (post.type == 'link') {
                var header = document.createElement('h4'),
                    link = document.createElement('a');
                link.setAttribute('href', post['link-url']);
                link.appendChild(document.createTextNode(post['link-text']));
                header.appendChild(link);
                postFragment.appendChild(header);
                if (post['link-description']) {
                    var description = document.createElement('div');
                    description.innerHTML = post['link-description'];
                    postFragment.appendChild(description);
                }
            } else if (post.type == 'video') {
                if (post['video-caption']) {
                    var caption = document.createElement('div');
                    caption.innerHTML = post['video-caption'];
                    postFragment.appendChild(caption);
                }
                var video = document.createElement('div');
                video.innerHTML = post['video-player-250'];
                postFragment.appendChild(video);
            }

            tumblrPosts.appendChild(postFragment);
        }

        document.getElementById(options.tumblrFeedId).appendChild(tumblrPosts);
    }

    return {
        getTumblrFeed: function(account, options) {
            var o = $.extend({}, defaultOptions, options);
            o.account = account;
            $.ajax({
                url : 'http://' + account + '.tumblr.com/api/read/json?number=' + o.count,
                dataType: 'jsonp',
                error: function (err) { $(o.tumblrFeedId).addClass('error').text("Tumblr's busted"); },
                success: function(data) { showTumblrFeed(data, o); }
            });
        }
    };
})(jQuery);