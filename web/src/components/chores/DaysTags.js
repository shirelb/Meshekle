import React, { Component } from 'react';
import './tagStyle.css';
import { WithContext as ReactTags } from 'react-tag-input';



export default class DaysTags extends Component {
  constructor(props) {
    super(props);
    console.log("in constructor : ", props);
    
    this.state = {
      tags: [],
      suggestions:  [],
      unchoosedTags:[], /*[
        { id: 1, text: "ראשון" },
        { id: 2, text: "שני" },
        { id: 3, text: "שלישי" },
        { id: 4, text: "רביעי" },
        { id: 5, text: "חמישי" },
        { id: 6, text: "שישי" },
        { id: 7, text: "שבת" }
      ]*/
      days: ""
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.handleEnTagClick = this.handleEnTagClick.bind(this);
    this.handleDisTagClick = this.handleDisTagClick.bind(this);
  }

  componentWillMount() {
    console.log("in componentWillMount:", this.props.settings.days);
    let choreDays = [];
    let otherDays = [];
    let days = "";
    if((this.props.settings.days).includes("ראשון") ){
      choreDays.push({ id: 1, text: "ראשון" });
      days = days +" "+ "ראשון";
    }
    else{
      otherDays.push({ id: 1, text: "ראשון" });
    }
    if(this.props.settings.days.includes("שני") ){
      choreDays.push({ id: 2, text: "שני" });
      days = days +" "+ "שני";
    }
    else{
      otherDays.push({ id: 2, text: "שני" });
    }
    if(this.props.settings.days.includes("שלישי") ){
      choreDays.push({ id: 3, text: "שלישי" });
      days = days +" "+ "שלישי";
    }
    else{
      otherDays.push({ id: 3, text: "שלישי" });
    }
    if(this.props.settings.days.includes("רביעי") ){
      choreDays.push({ id: 4, text: "רביעי" });
      days = days +" "+ "רביעי";
    }
    else{
      otherDays.push({ id: 4, text: "רביעי" });
    }
    if(this.props.settings.days.includes("חמישי") ){
      choreDays.push({ id: 5, text: "חמישי" });
      days = days +" "+ "חמישי";
    }
    else{
      otherDays.push({ id: 5, text: "חמישי" });
    }
    if(this.props.settings.days.includes("שישי") ){
      choreDays.push({ id: 6, text: "שישי" });
      days = days +" "+ "שישי";
    }
    else{
      otherDays.push({ id: 6, text: "שישי" });
    }
    if(this.props.settings.days.includes("שבת") ){
      choreDays.push({ id: 7, text: "שבת" });
      days = days +" "+ "שבת";
    }
    else{
      otherDays.push({ id: 7, text: "שבת" });
    }
    
    this.setState({tags: choreDays, unchoosedTags:otherDays, days:days});
    console.log("this.state.tags:", this.state.tags);
  }


  handleDelete(i) {
    this.setState({
      tags: this.state.tags.filter((tag, index) => index !== i),
    });
  }

  handleAddition(tag) {
    let { tags } = this.state;
    this.setState({ tags: [...tags, { id: tags.length + 1, text: tag }] });
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags];

    // mutate array
    tags.splice(currPos, 1);
    tags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags });
  }

  handleEnTagClick(index) {
    let unTags = this.state.unchoosedTags;
    console.log('!!!The tag at index '+index + this.state.tags[index] + ' was clicked', this.state.tags[index].text);

    let newTag = this.state.tags;
    let days=""
    days.replace(newTag[index].text, " ");
    let removedTag= newTag.splice(index, 1);
    newTag.map(e=>days = days+" "+ e.text)//String(this.state.days);
    console.log('The tag at index ' + removedTag + ' was clicked',days);
    unTags.push(removedTag[0])
    this.setState({'tags': newTag, 'unchoosedTags': unTags, days:days});
    this.props.onChange(days);
  }

  handleDisTagClick(index) {
    console.log('The tag at index ' + this.state.unchoosedTags[index] + ' was clicked');
    let newTag = this.state.tags;
    newTag.push(this.state.unchoosedTags[index]);
    let unTags = this.state.unchoosedTags;
    
    let days = this.state.days;
    days = " "+days +" "+ this.state.unchoosedTags[index].text+" "
    unTags.splice(index, 1);
    this.setState({'tags': newTag, 'unchoosedTags': unTags, days:days});
    let updatedSettings = this.props.settings;
    updatedSettings.days = days;
    this.props.onChange(days);
  }



  render() {
    const { tags, suggestions, unchoosedTags } = this.state;
    return (
      <div  id="app">
        <h4>ימים שנבחרו:</h4>
        <ReactTags
        readOnly= {true}
          tags={tags}
          suggestions={suggestions}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          handleDrag={this.handleDrag}
          handleTagClick={this.handleEnTagClick}
        /><h4>הוסף לימים:</h4><ReactTags
        readOnly= {true}
          tags={unchoosedTags}
          suggestions={suggestions}
          handleDelete={this.handleDelete}
          handleAddition={false}
          
          handleDrag={this.handleDrag}
          handleTagClick={this.handleDisTagClick}
        />
        <h5>יש ללחוץ על יום כדי להוסיפו או להסירו מימי ביצוע התורנות</h5>



      </div>
    );
  }
}