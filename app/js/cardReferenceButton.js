// Use the built-in version of React if your site does not use React
var React = AlloyEditor.React

var ButtonCardReference = React.createClass({
  mixins: [AlloyEditor.ButtonStyle, AlloyEditor.ButtonStateClasses, AlloyEditor.ButtonActionStyle],

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
      <button className={cssClass} data-type='button-card-reference' onClick={this.applyStyle} tabIndex={this.props.tabIndex}>
        <span className = 'ae-icon-separator'>< /span>
      </button>
    )
  }
})

AlloyEditor.Buttons[ButtonCardReference.key] = AlloyEditor.ButtonCardReference = ButtonCardReference
console.log('swag money boiz')
