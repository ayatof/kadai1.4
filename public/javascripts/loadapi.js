var a = "";
$(document).ready(function(){
    $.getJSON("http://127.0.0.1:3000/home_timeline.json", function(data){
	//$(".top").append("<h1 class='title'>"+data.+"</h1>");
        $.each(data, function(i,item){
            var txt = item.text
			    .replace(/\"/,'&quot;')
                .replace(/(https?:\/\/[-a-z0-9._~:\/?#@!$&\'()*+,;=%]+)/ig,'<a href="$1">$1</a>')
                .replace(/@+([_A-Za-z0-9-]+)/ig, '<a href="https://twitter.com/$1">@$1</a>')
                .replace(/#+([_A-Za-z0-9-]+)/ig, '<a href="https://twitter.com/search?q=$1">#$1</a>');
			//$(".sec_tweets").append("<p>"+txt+"<p>");
			$(".sec_tweets").append("<article class='tweet'>\n"+
				"<header class='user_profile'>\n"+
					"<a class='user_name' href='https://twitter.com/"+
					item.user.screen_name+"'>@"+item.user.screen_name+"&nbsp;/&nbsp;"+item.user.name+
					"</a>\n"+
				"</header>\n"+
			    "<p class='text'>"+txt+"</p>\n"+
			"</article>\n");
        });
		$(".user_name").css("text-decoration","none");
    });
});

