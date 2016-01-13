// Use the built-in version of React if your site does not use React
(function () {
  'use strict'

  var ButtonCardReference = React.createClass({
    mixins: [
      AlloyEditor.ButtonStyle, AlloyEditor.ButtonStateClasses, AlloyEditor.ButtonActionStyle
    ],

    propTypes: {
      editor: React.PropTypes.object.isRequired
    },

    getDefaultProps: function () {
      return {
        style: {
          element: 'cardReference'
        }
      }
    },

    statics: {
      key: 'cardReference'
    },

    render: function () {
      var cssClass = 'ae-button ' + this.getStateClasses()

      return (
        <button className={cssClass} data-type='button-card-reference' onClick={this.activateCardReferenceUI()} tabIndex={this.props.tabIndex}>
          <span className='ae-icon-separator'></span>
        </button>
      )
    },
    options: { // set overlay options
      'keyboard': true, // teardown when <esc> key is pressed (default: true)
      'static': true, // maintain overlay when clicked (default: false)
      'onclose': function () {} // execute function when overlay is closed
    },
    activateCardReferenceUI: function () {
      // initialize with child element
      var modalEL = document.createElement('div')

      modalEl.style.width = '400px'
      modalEl.style.height = '300px'
      modalEl.style.margin = '100px auto'
      modalEl.style.backgroundColor = '#fff'

      // options and child element
      mui.overlay('on', options, modalEL)
    }
  })
  AlloyEditor.Buttons[ButtonCardReference.key] = AlloyEditor.ButtonCardReference = ButtonCardReference
  console.log('swag money boiz')
}())
