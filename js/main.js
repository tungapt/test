var player = videojs('my-player', {
    controls: true,
    autoplay: false,
    preload: 'auto',
    width: '800px'
});
//mảng dữ liệu marker truyền vào
let newArr = [
    {
        time: 0,
        text: "Bắt đầu",
        status: true,
    },
    {
        time: 2,
        text: "Nội dung đính chính 1",
        class: 'study',
        status: false,
    },
    {
        time: 3,
        text: "\\(ax^2 + bx + c = 0\\)",
        class: 'mainContent',
        status: false,
        type: 'quiz'
    },
    {
        time: 5,
        text: "Nội dung đính chính 2",
        class: 'study',
        status: false,
    },
    {
        time: 7,
        text: "\\(x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}\\)",
        class: 'mainContent',
        status: false,
        type: 'quiz'
    }
]

// class gói code thêm marker vào video Js
// trỏ vào function addQuestionToVideo để thực hiện thêm marker vào video.
// đối addQuestionToVideo(tượng video js + dữ liệu marker)
class MarkerVideoJS {
    // thêm các điểm marker vào trong video
    addQuestionToVideo(videoJs_Obj, arr) {
        var startTimer = null
        let makerVideo = new MarkerVideoJS();
        videoJs_Obj.markers({
            markers: arr,
            onMarkerReached: function (marker, id) {
                if (marker.status != true && marker.time == Math.round(videoJs_Obj.currentTime())) {
                    $('#popupNotifi .popupNotifiContent').remove();
                    $('#popupNotifi').append(`<span class="popupNotifiContent">Bài tập: ` + marker.text + `</span>`);
                    if (marker.type == 'quiz') {
                        $('#popupNotifi').addClass('handleQuiz');
                        $('#popupNotifi > p span:nth-child(1)').html('BÀI TẬP:');
                        $('#popupNotifi > p span:nth-child(2)').html('phút thứ ' + marker.time)
                    } else {
                        $('#popupNotifi').removeClass('handleQuiz');
                        $('#popupNotifi > p span:nth-child(1)').html('ĐÍNH CHÍNH:');
                        $('#popupNotifi > p span:nth-child(2)').html('phút thứ ' + marker.time)
                    }
                    MathJax.Hub.Queue(['Typeset', MathJax.Hub, $('#popupNotifi .popupNotifiContent')[0]]);
                    $('#popupNotifi').fadeIn();

                    if (startTimer != null) {
                        clearTimeout(startTimer);
                    }
                    startTimer = setTimeout(function (params) {
                        $('#popupNotifi').fadeOut();
                    }, 10000);
                }
            },
            markerStyle: {
                'width': '8px',
                'border-radius': '0'
            },
            markerTip: {
                display: false,
            }
        });
        // temp study from
        const htmlBaiTap = `<div class="cauHoi" id="cauHoi">
        <p>bài tập</p>
        <div class="contentHomeWork">
          <div class="noiDung">
            Hệ thống 10 chữ số đặc biệt số 0 mà hiện nay ta đang dùng là phát minh của \\(x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}\\)
            A.Người Ai Cập cổ đại \\(x+y=z\\) 
            B.Người Ấn Độ cổ đại
            C.Người Trung Quốc cổ đại 
            D.Người Hi Lạp cổ đạiHệ thống 10 chữ số đặc biệt số 0 mà hiện nay ta đang dùng là phát minh của
          </div>
        </div>
        <div class="groundControl">
          <button onClick="makerVideo.handleControl(true)">Bỏ qua và xem tiếp</button>
          <button onClick="makerVideo.handleControl(false)">Quay lại nội dung chính</button>    
        </div>
      </div>`
        $('#' + videoJs_Obj.id_).append(htmlBaiTap);
        // popup Confirm skip video
        const popupConfirmSkip = `<div class="popupNotifi" id="popupNotifi" onClick="makerVideo.handleHomeWork()">
        <p>
          <span>ĐÍNH CHÍNH:</span>
          <span>Phút thứ 15:30</span>
        </p>
        <span class="popupNotifiContent"></span>
      </div>`
        $('#' + videoJs_Obj.id_).append(popupConfirmSkip);
    }
    // handle bỏ qua xem tiếp hay quay lại nội dung chính
    handleControl(status) {
        $('#cauHoi').fadeOut();
        if (status) {
            player.play();
            // newArr[timeHomework].status = true;
        } else {
            player.pause();
            player.markers.prev();
            player.markers.prev();
        }
    }
    // handle hiện popup thông báo có bài tập
    handleHomeWork() {
        let element = $('#popupNotifi').hasClass('handleQuiz');
        if (element) {
            $('#popupNotifi').fadeOut();
            player.pause();
            $('#cauHoi').fadeIn();
        }
    }
    // function ẩn hiện marker
    handleSwitchMarker(videoJs_Obj) {
        $('#' + videoJs_Obj.id_ + ' .vjs-marker').toggle()
    }
}
let makerVideo = new MarkerVideoJS();
makerVideo.addQuestionToVideo(player, newArr);
function handleMarker() {
    makerVideo.handleSwitchMarker(player);
}

let fullVideoIos = '<span id="fullVideoIos" class="btnFullVideoIos"></span>'
$('#' + player.id_ + ' .vjs-control-bar').append(fullVideoIos);

// set fullvideo on ios device
$('#fullVideoIos').after().on('click', function () {
    let idPlayer = $('#my-player')
    idPlayer.toggleClass('fullScreenIos');
    let check = idPlayer.hasClass('fullScreenIos')

    if(check){
        let w = document.documentElement.clientWidth;
        let h = document.documentElement.clientHeight;
        let marginTop = h/2;
        let marginLeft = w/2;
        $('#my-player').css({"width": h, "height":w,'margin-left':'-'+marginTop+'px','margin-top':'-'+marginLeft+'px'});
    }else{
        $('#my-player').attr('style',"")
    }  
})
