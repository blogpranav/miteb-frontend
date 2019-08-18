import React from 'react'
import { connect } from 'react-redux'
import { List, ListItem } from 'material-ui/List'
import Checkbox from 'material-ui/Checkbox'
import Toggle from 'material-ui/Toggle'
import Divider from 'material-ui/Divider'
import Badge from 'material-ui/Badge'
import Subheader from 'material-ui/Subheader'
import Delete from 'material-ui/svg-icons/content/remove-circle'
import Dropzone from 'react-dropzone'
import TextField from 'material-ui/TextField'
import IconButton from 'material-ui/IconButton'

class MediumContainer extends React.Component {
  constructor (props) {
    super(props)

    this.handleClick.bind(this)
    this.handleToggle.bind(this)
    this.state = {
      checkboxValue: 0,
      checked: this.props.checkedMediums,
      clickedValue: 0,
      indexes: this.props.indexesMediums,
      object: { 0: 'Banner', 1: 'InfoDesk', 2: 'Digital Board', 3: 'Poster' },
      files: this.props.filesMediums,
      fields: this.props.fields,
      deskTouch: false
    }
  }

  componentWillMount () {
    this.validationMedia()
  }

  updateShared (checked) {
    this.props.updateShared(checked)
  }

  handleClick (location) {
    this.setState({
      clickedValue: location
    })
  }

  onPreviewDrop (files) {
    this.setState({
      files: this.state.files.concat(files)
    })
    this.props.updateFiles(this.state.files)
    this.validationMedia()
  }

  removePicture (file) {
    var files = this.state.files
    var i = files.indexOf(file)
    if (i !== -1) {
      files.splice(i, 1)
    }
    this.setState({
      files: files
    })
    this.validationMedia()
  }

  renderPoster () {
    const previewStyle = {
      display: 'inline',
      width: 100,
      height: 100
    }

    return (
      <a style={{ cursor: this.state.checked[3] ? 'pointer' : 'not-allowed' }}>
        <div className='dropzone' style={{ marginLeft: 50, marginRight: 50, border: !this.state.checked[3] ? '1px dotted grey' : '1px dotted blue', minHeight: 100 }}>
          <Dropzone style={{ 'width': '100%', 'height': '100%' }} disabled={!this.state.checked[3]} accept='image/*' onDrop={this.onPreviewDrop} multiple>
            <div style={{ color: !this.state.checked[3] ? 'grey' : 'black', textAlign: 'center' }} > Upload your posters here </div>
          </Dropzone>
          {this.state.files.length > 0 &&
            <div>
              {this.state.files.map((file) => (

                <Badge
                  badgeContent={<IconButton style={{}} onClick={this.removePicture.bind(this, file)}> <Delete /> </IconButton>}
                >
                  <img
                    alt='Preview'
                    key={file.preview}
                    src={file.preview}
                    style={previewStyle}
                    onClick={this.removePicture.bind(this, file)}
                  />
                </Badge>
              ))}

            </div>
          }
        </div>
      </a>)
  }

  validationMedia () {
    let checked = this.state.checked
    let indexes = this.state.indexes
    let isChecked = !(Object.values(checked).every(v => v === false))
    let isFormValid = isChecked ? !checked.some((key, index) => key ? Object.values(indexes[index]).every(v => v === false) : false) : false
    let deskCheck = this.state.checked[1] ? (this.state.fields['noDesks'] > 0) : true
    let posterCheck = this.state.checked[3] ? this.state.files.length > 0 : true
    this.props.updateValidation(isFormValid && deskCheck && posterCheck)
  }

  handleToggle (s, i) {
    let indexes = this.state.indexes;
    (indexes[s])[i] = !(indexes[s])[i]
    this.setState({ indexes })
    let index = Object.values(indexes[s])
    this.validationMedia()
    this.props.updateToggle(indexes)
    if (index.filter(i => i === true).length === 1) this.checkAutomatically(s, true)
    if (index.every(i => i === false)) this.checkAutomatically(s, false)
  }

  checkAutomatically (value, state) {
    let checkedArray = this.state.checked
    checkedArray[value] = state
    this.setState({ checkedArray })
  }

  updateCheck (value) {
    let checkedArray = this.state.checked
    checkedArray[value] = !checkedArray[value]
    this.setState({ checkedArray })
    this.validationMedia()
    this.props.updateShared(this.state.checked)
  }

  handleChange (field, e) {
    let fields = this.state.fields
    fields[field] = e.target.value
    this.setState({ fields })
    this.validationMedia()
    this.props.updateInfo(fields)
  }

  handleBlur (field, e) {
    this.setState({
      deskTouch: true
    })
  }

  renderCard () {
    var value = this.state.clickedValue
    var medium = this.state.object[value]
    var steps = ['Academics Blocks', 'First Years Hostel Blocks', 'Senior Hostel Blocks', 'Mess']
    var listSec = ['NLH,AB1,AB2,AB5,IC', 'XI,XII,XCI,XVII,XVIII', 'IX,XIII,XIV', 'FC,Annapoorna,Apoorva']
    return (<div>
      <List>
        <Subheader style={{ textAlign: 'center' }}> {medium} </Subheader>
        {steps.map((step, index) => {
          var a = '' + value + index
          return (<ListItem style={{ textAlign: 'left' }} key={a} hidden={medium === 'InfoDesk' && (index === 1 || index === 2)} secondaryText={listSec[index]} primaryText={step} rightToggle={<Toggle style={{ marginRight: 0 }} key={a} toggled={(this.state.indexes[value])[index]} onToggle={this.handleToggle.bind(this, value, index)} />} />
          )
        })}
        {medium === 'InfoDesk' &&
          <div style={{ marginLeft: 20, marginTop: 0, position: 'relative' }}>
            <TextField
              floatingLabelText='Number of desks'
              type='number'
              onChange={this.handleChange.bind(this, 'noDesks')}
              onBlur={this.handleBlur.bind(this, 'noDesks')}
              underlineShow
              value={this.state.fields['noDesks']}
              errorText={this.state.deskTouch && !(this.state.fields['noDesks'] > 0) && this.state.checked[1] && 'Enter a valid value'}
              required
            />
            <TextField
              floatingLabelText='Others'
              onChange={this.handleChange.bind(this, 'otherInfo')}
              type='text'
              required
            />
          </div>
        }
      </List>
    </div>)
  }

  renderMedia () {
    return (<div>
      <List>
        <Subheader style={{ textAlign: 'center' }}> Media </Subheader>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Checkbox value={0} checked={this.state.checked[0]} style={{ width: 48, height: 48, paddingTop: 20, paddingBottom: 15 }}onCheck={this.updateCheck.bind(this, 0)} />
          <ListItem
            style={{ minHeight: 65, textAlign: 'left', minWidth: 400, paddingTop: 10, backgroundColor: this.state.clickedValue === 0 ? 'lightgray' : null }}
            onClick={this.handleClick.bind(this, 0)}
            primaryText='Banner'
          />
        </div>
        <Divider />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Checkbox value={1} checked={this.state.checked[1]} style={{ width: 48, height: 48, paddingTop: 20, paddingBottom: 15 }} onCheck={this.updateCheck.bind(this, 1)} />
          <ListItem
            style={{ minHeight: 65, textAlign: 'left', minWidth: 400, paddingTop: 10, backgroundColor: this.state.clickedValue === 1 ? 'lightgray' : null }}
            onClick={this.handleClick.bind(this, 1)}
            primaryText='InfoDesk'
          />
        </div>
        <Divider />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Checkbox value={2} checked={this.state.checked[2]} style={{ width: 48, height: 48, paddingTop: 20, paddingBottom: 15 }} onCheck={this.updateCheck.bind(this, 2)} />
          <ListItem
            style={{ minHeight: 65, textAlign: 'left', minWidth: 400, paddingTop: 10, backgroundColor: this.state.clickedValue === 2 ? 'lightgray' : null }}
            onClick={this.handleClick.bind(this, 2)}
            primaryText='Digital Board'
          />
        </div>
        <Divider />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Checkbox value={3} checked={this.state.checked[3]} style={{ width: 48, height: 48, paddingTop: 20, paddingBottom: 15 }} onCheck={this.updateCheck.bind(this, 3)} />
          <ListItem
            style={{ minHeight: 65, textAlign: 'left', minWidth: 400, paddingTop: 10, backgroundColor: this.state.clickedValue === 3 ? 'lightgray' : null }}
            onClick={this.handleClick.bind(this, 3)}
            primaryText='Poster'
          />
        </div>
        {this.renderPoster()}
      </List>
    </div>)
  }

  render () {
    return (
      <div style={{ display: 'flex', flexDirection: this.props.isMobile ? 'column' : 'row' }}>
        <div style={{ width: '100%', minHeight: 300 }}>
          {this.renderMedia()}
        </div>
        <div style={{ display: this.props.isMobile ? 'none' : '', height: 350, border: '1px solid lightgrey' }} />
        <div style={{ width: '100%', minHeight: 300 }}>
          {this.renderCard()}
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  const { isMobile } = state.toggler
  const { user } = state.authentication
  return {
    isMobile,
    user
  }
}

export default connect(mapStateToProps)(MediumContainer)
