export default function headInitializer(options) {
  $('head').append(`<link href='https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' rel='stylesheet' integrity='sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN' crossorigin='anonymous'>`)
  $('head').append(`<style id='novels-reader-style'>
    .highlight {
      color: ${options.textColor == undefined ? '#fff' : options.textColor};
      background-color: ${options.backgroundColor == undefined ? '#498fd9' : options.backgroundColor};
    }

    .controll-button {
      color: ${$('#novel_color').css('color')};
      position: absolute;
      cursor: pointer;
    }
    .controll-button:hover {
      color: #18b7cd;
    }

    .controll-button .fa {
      line-height: inherit;
      font-size: 120%;
    }

    p.include-ruby .controll-button .fa {
      margin-top: ${$('ruby rt').height()}px;
      line-height: ${$('ruby rb').height()}px;
    }

    .controll-button.play {
      margin-left: -25px;
    }
    .controll-button.stop {
      position: fixed;
      top: ${$('#novel_header').height() + 15}px;
      left: 15px;
      font-size: 30px;
    }
  </style>`)
}