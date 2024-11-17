import React, { useState } from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Button,
  useColorScheme,
  Alert,
  View,
} from 'react-native';

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

async function graphQLFetch(query, variables = {}) {
  try {
    /****** Q4: Start Coding here. State the correct IP/port******/
    // let emulator sends to the underlying laptop
    const response = await fetch('http://10.0.2.2:3000/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables })
      /****** Q4: Code Ends here******/
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];
      if (error.extensions.code == 'BAD_USER_INPUT') {
        const details = error.extensions.exception.errors.join('\n ');
        alert(`${error.message}:\n ${details}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }
    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
  }
}

class IssueFilter extends React.Component {
  render() {
    return (
      <>
        {/****** Q1: Start Coding here. ******/}
        <View>
          <Text style={styles.h2}>IssueFilter</Text>
          <Text>Placeholder for IssueFilter</Text>
        </View>
        {/****** Q1: Code ends here ******/}
      </>
    );
  }
}

const styles = StyleSheet.create({
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  container: {
    padding: 16, 
    backgroundColor: '#B2DFDB'
  },
  header: {
    flexDirection: 'row',
    fontWeight: 'bold',
    alignItems: 'center', height: 50, backgroundColor: '#537791'
  },
  text: { textAlign: 'center' },
  dataWrapper: { marginTop: -1 },
  row: {
    flexDirection: 'row', alignItems: 'center', height: 40,
    backgroundColor: '#E7E6E1',
    borderColor: 'black', borderBottomWidth: 1
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  }
});

const width = [40, 80, 80, 80, 80, 80, 200];

function IssueRow(props) {
  const issue = props.issue;
  {/****** Q2: Coding Starts here. Create a row of data in a variable ******/ }
  {/****** issueList {
    id title status owner
    created effort due
    }******/ }
  {/****** Q2: Coding Ends here.******/ }
  return (
    <>
      {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
      <View style={styles.row}>

        <Text style={[styles.text, { width: width[0] }]}>{issue.id}</Text>
        <Text style={[styles.text, { width: width[1] }]}>{issue.title}</Text>
        <Text style={[styles.text, { width: width[2] }]}>{issue.status}</Text>
        <Text style={[styles.text, { width: width[3] }]}>{issue.owner}</Text>
        <Text style={[styles.text, { width: width[4] }]}>{issue.created.toDateString()}</Text>
        <Text style={[styles.text, { width: width[5] }]}>{issue.effort}</Text>
        <Text style={[styles.text, { width: width[6] }]}>{issue.due ? issue.due.toDateString() : ''}</Text>

      </View>
      {/****** Q2: Coding Ends here. ******/}
    </>
  );
}


function IssueTable(props) {
  const issueRows = props.issues.map(issue =>
    <IssueRow key={issue.id} issue={issue} />
  );

  {/****** Q2: Start Coding here. Add Logic to initalize table header  ******/ }

  {/****** Q2: Coding Ends here. ******/ }


  return (
    <View style={styles.container}>
      <Text style={styles.h2}>Issue Table</Text>
      {/****** Q2: Start Coding here to render the table header/rows.**********/}
      {/* Table Header */}
      <View>
        <ScrollView horizontal>
          <View>
            <View style={styles.header}>
              <Text style={[styles.text, { width: width[0] }]}>id</Text>
              <Text style={[styles.text, { width: width[1] }]}>title</Text>
              <Text style={[styles.text, { width: width[2] }]}>status</Text>
              <Text style={[styles.text, { width: width[3] }]}>owner</Text>
              <Text style={[styles.text, { width: width[4] }]}>created</Text>
              <Text style={[styles.text, { width: width[5] }]}>effort</Text>
              <Text style={[styles.text, { width: width[6] }]}>due</Text>
            </View>
            <View style={styles.dataWrapper}>{issueRows}</View>
          </View>
        </ScrollView>
        <Text>Scroll to see all columns</Text>
      </View>
      {/****** Q2: Coding Ends here. ******/}
    </View>
  );
}


class IssueAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    /****** Q3: Start Coding here. Create State to hold inputs******/
    this.state = { owner: '', title: '', effort: 1 };
    /****** Q3: Code Ends here. ******/
  }

  /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
  setOwner(newOwner) {
    this.setState({ owner: newOwner });
  }
  setTitle(newTitle) {
    this.setState({ title: newTitle });
  }
  setEffort(newEffort) {
    // Effort should be a number, handle input properly
    const numericEffort = parseInt(newEffort, 10) || 1;
    this.setState({ effort: numericEffort });
  }
  /****** Q3: Code Ends here. ******/

  handleSubmit() {
    /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
    const { title, owner, effort } = this.state;

    if (!title.trim()) {
      Alert.alert('Validation Error', 'Title cannot be empty.');
      return;
    }

    const issue = {
      title: title.trim(),
      owner: owner.trim() || 'Anonymous', // 提供默认值
      effort: effort,
      due: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10), // 10天后到期
    };

    this.props.createIssue(issue);
    this.newTitleInput.clear();
    this.newOwnerInput.clear();
    this.newEffortInput.clear();
    /****** Q3: Code Ends here. ******/
  }

  render() {
    return (
      <View>
        {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
        <Text style={styles.h2}>Add Issue</Text>
        <TextInput style={styles.input} ref={(input) => { this.newTitleInput = input; }} placeholder="Title" onChangeText={(newTitle) => this.setTitle(newTitle)} />
        <TextInput style={styles.input} ref={(input) => { this.newOwnerInput = input; }} placeholder="Owner" onChangeText={(newOwner) => this.setOwner(newOwner)} />
        <TextInput style={styles.input} ref={(input) => { this.newEffortInput = input; }} placeholder="Effort" keyboardType="numeric" onChangeText={(newEffort) => this.setEffort(newEffort)} />

        <Button onPress={this.handleSubmit} title="Add" />
        {/****** Q3: Code Ends here. ******/}
      </View>
    );
  }
}

class BlackList extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    /****** Q4: Start Coding here. Create State to hold inputs******/
    this.state = { name: '' };
    /****** Q4: Code Ends here. ******/
  }
  /****** Q4: Start Coding here. 
   * Add functions to hold/set state input based on changes in TextInput******/
  setBlackListName(newName) {
    console.log("setBlackListName", newName);
    this.setState({ name: newName });
  }
  /****** Q4: Code Ends here. ******/

  async handleSubmit() {
    /****** Q4: Start Coding here. 
     * Create an issue from state variables and issue a query. 
     * Also, clear input field in front-end******/
    const query = `mutation blackListAdd($name: String!) {
    addToBlacklist(nameInput: $name) 
    }`;
    const data = await graphQLFetch(query, { name: this.state.name });
    this.newNameInput.clear();
    /****** Q4: Code Ends here. ******/
  }

  render() {
    return (
      <View>
        {/****** Q4: Start Coding here. 
          Create TextInput field, populate state variables. 
          Create a submit button, and on submit, trigger handleSubmit.*******/}
        <Text style={styles.h2}>Add Blacklist</Text>
        <TextInput style={styles.input} ref={(input) => { this.newNameInput = input; }} placeholder="Name to Blacklist" onChangeText={(newName) => this.setBlackListName(newName)} />
        <Button onPress={this.handleSubmit} title="Add to Blacklist" />
        {/****** Q4: Code Ends here. ******/}
      </View>
    );
  }
}

export default class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [] };
    this.createIssue = this.createIssue.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
        issueList {
        id title status owner
        created effort due
        }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
      this.setState({ issues: data.issueList });
    }
  }

  async createIssue(issue) {
    console.log("createIssue", issue);
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
        id
        }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
      this.loadData();
    }
  }


  render() {
    return (
      <>
        {/****** Q1: Start Coding here. ******/}
        <IssueFilter />
        {/****** Q1: Code ends here ******/}


        {/****** Q2: Start Coding here. ******/}
        <IssueTable issues={this.state.issues} />
        {/****** Q2: Code ends here ******/}


        {/****** Q3: Start Coding here. ******/}
        <IssueAdd createIssue={this.createIssue} />
        {/****** Q3: Code Ends here. ******/}

        {/****** Q4: Start Coding here. ******/}
        <BlackList />
        {/****** Q4: Code Ends here. ******/}
      </>

    );
  }
}