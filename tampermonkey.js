// ==UserScript==
// @name         Delfi smiler
// @namespace    https://www.delfi.lt/
// @version      0.1
// @description  Show smiles before read
// @author       pastuh
// @include      https://www.delfi.lt/*
// @match        https://api.delfi.lt/*
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-latest.js
// ==/UserScript==

GM_addStyle(`
body {
    background-color: #eee;
}
#nuomoniu-ringas-slider .hcarousel {
    min-height: 285px;
    max-height: 350px;
}
.tops-carousel {
    min-height: 480px !important;
}
.reactions-inserted {
    display: inline-flex;
    padding: initial;
}
.reactions-inserted img {
    width: 20px;
    padding-left: 6px;
}
.reactions-inserted .flex-container {
    display: flex;
    align-items: center;
    background: #d9d9d9;
    margin-left: 2px;
}
.emptyReaction {
    opacity: 0.2;
}
`);

// Check if headline without smile is visible
$.fn.isInViewport = function() {
    let elementTop = $(this).offset().top;
    let elementBottom = elementTop + $(this).outerHeight();

    let viewportTop = $(window).scrollTop();
    let viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};

// Scroll and Mark not smiling headlines
$(window).on('resize scroll', function() {
    $('.headline .headline-title').each(function() {
        if ($(this).isInViewport()) {
            if (!$(this).hasClass('smiling')) {
                callSmilers(this);
            }
        }
    });
});

function callSmilers(value) {
    $(value).addClass('smiling');

    let search_id = $(value).find('a')[0].search;

    if(search_id.indexOf("id=") >= 0) {
        let headline_id = search_id.match(/\d+/)[0];
        getSmiles(headline_id).then(data => countSmiles(data)).then(data => showSmiles(data, value));
    }
}

async function getSmiles(id) {
    let channel_id = Math.floor(Math.random() * (900 - 1)) + 1;
    let response = await fetch( `https://api.delfi.lt/comment/v1/query/getCommentsByConfig?articleId=${id}&channelId=${channel_id}&modeType=ALL&orderBy=REACTIONS_DESC` );
    let result = await response.json();
    return result;
}

async function countSmiles(headline) {
    let likes = 0;
    let dislikes = 0;
    let angries = 0;
    let hahas = 0;
    let surpries = 0;
    let loves = 0;
    let sads = 0;

    //console.log(headline);

    if(headline.data.getCommentsByConfig.articleEntity !== null){
        let posts = headline.data.getCommentsByConfig.articleEntity.comments;

        posts.forEach(post => {

            if(post.reaction !== null) {
                let reactions = post.reaction;
                reactions.forEach(reaction => {
                    if( reaction.name === 'Like') {
                        likes += reaction.count;
                    }
                    if( reaction.name === 'Dislike') {
                        dislikes += reaction.count;
                    }
                    if( reaction.name === 'Angry') {
                        angries += reaction.count;
                    }
                    if( reaction.name === 'Ha-Ha') {
                        hahas += reaction.count;
                    }
                    if( reaction.name === 'Surprised') {
                        surpries += reaction.count;
                    }
                    if( reaction.name === 'Love') {
                        loves += reaction.count;
                    }
                    if( reaction.name === 'Sad') {
                        sads += reaction.count;
                    }

                });
            }

        })
    }

    return ([
        {
            name: "Likes", count: likes
        },
        {
            name: "Dislikes", count: dislikes
        },
        {
            name: "Angry", count: angries
        },
        {
            name: "Ha-Ha", count: hahas
        },
        {
            name: "Surprised", count: surpries
        },
        {
            name: "Love", count: loves
        },
        {
            name: "Sad", count: sads
        }
    ])

}

async function showSmiles(smiles, headline) {
    let template = `<ul class="reactions-inserted">
<li class="flex-container ${smiles[0].count !== 0 ? '' : 'emptyReaction'}"><div class="reaction-icon"><div><div title="Like" class="reaction"><img src="https://g.dcdn.lt/misc/comment-fe/img/reactions/reaction-like.svg"></div></div></div><div class="reaction-cnt"><span>
${smiles[0].count !== 0 ? smiles[0].count : '0'}
</span></div></li>
<li class="flex-container ${smiles[1].count !== 0 ? '' : 'emptyReaction'}"><div class="reaction-icon"><div><div title="Dislike" class="reaction"><img src="https://g.dcdn.lt/misc/comment-fe/img/reactions/reaction-dislike.svg"></div></div></div><div class="reaction-cnt"><span>
${smiles[1].count !== 0 ? smiles[1].count : '0'}
</span></div></li>
<li class="flex-container ${smiles[2].count !== 0 ? '' : 'emptyReaction'}"><div class="reaction-icon"><div><div title="Angry" class="reaction"><img src="https://g.dcdn.lt/misc/comment-fe/img/reactions/reaction-angry.svg"></div></div></div><div class="reaction-cnt"><span>
${smiles[2].count !== 0 ? smiles[2].count : '0'}
</span></div></li>
<li class="flex-container ${smiles[3].count !== 0 ? '' : 'emptyReaction'}"><div class="reaction-icon"><div><div title="Ha-Ha" class="reaction"><img src="https://g.dcdn.lt/misc/comment-fe/img/reactions/reaction-haha.svg"></div></div></div><div class="reaction-cnt"><span>
${smiles[3].count !== 0 ? smiles[3].count : '0'}
</span></div></li>
<li class="flex-container ${smiles[4].count !== 0 ? '' : 'emptyReaction'}"><div class="reaction-icon"><div><div title="Surprised" class="reaction"><img src="https://g.dcdn.lt/misc/comment-fe/img/reactions/reaction-surprised.svg"></div></div></div><div class="reaction-cnt"><span>
${smiles[4].count !== 0 ? smiles[4].count : '0'}
</span></div></li>
<li class="flex-container ${smiles[5].count !== 0 ? '' : 'emptyReaction'}"><div class="reaction-icon"><div><div title="Love" class="reaction"><img src="https://g.dcdn.lt/misc/comment-fe/img/reactions/reaction-love.svg"></div></div></div><div class="reaction-cnt"><span>
${smiles[5].count !== 0 ? smiles[5].count : '0'}
</span></div></li>
<li class="flex-container ${smiles[6].count !== 0 ? '' : 'emptyReaction'}"><div class="reaction-icon"><div><div title="Sad" class="reaction"><img src="https://g.dcdn.lt/misc/comment-fe/img/reactions/reaction-sad.svg"></div></div></div><div class="reaction-cnt"><span>
${smiles[6].count !== 0 ? smiles[6].count : '0'}
</span></div></li>
</ul>`;

    // Add smiles block for each headline
    $(headline).append(template);
}

