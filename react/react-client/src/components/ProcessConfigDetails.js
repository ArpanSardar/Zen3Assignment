import React, { Component } from 'react';
import axios from 'axios';
import { Select, Button, message, Popconfirm, Form, Input, Icon } from 'antd';
import 'antd/dist/antd.css';

const { Option } = Select;

class ProcessConfigDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      envData: null,
      processValue: 'PROCESS1',
      hostEdit: false,
      passwordEdit: false,
      connectionEdit: false
    };
  }
  handleChange = value => {
    this.setState({ processValue: value });
  };
  onTextChange = e => {
    this.setState({
      envData: { ...this.state.envData, [e.target.name]: e.target.value }
    });
  };
  getDetails = () => {
    axios
      .get(
        `http://localhost:5000/api/valuefinder/getEnvironment/${this.state.processValue}`
      )
      .then(res => {
        this.setState({ envData: res.data });
      })
      .catch(err => {
        message.error('Error in data loading');
        console.log('Environment load error: ', err);
      });
  };
  hostSave = () => {
    axios
      .post(
        `http://localhost:5000/api/valuefinder/setEnvironment/${this.state.processValue}/DATABASE_HOST/${this.state.envData.DATABASE_HOST}`
      )
      .then(res => {
        this.setState({ hostEdit: false });
        message.success('Data updated successfully');
      })
      .catch(err => {
        message.error('Error in data update');
        console.log('Environment load error: ', err);
      });
  };
  passwordSave = () => {
    axios
      .post(
        `http://localhost:5000/api/valuefinder/setEnvironment/${this.state.processValue}/DATABASE_PASSWORD/${this.state.envData.DATABASE_PASSWORD}`
      )
      .then(res => {
        this.setState({ passwordEdit: false });
        message.success('Data updated successfully');
      })
      .catch(err => {
        message.error('Error in data update');
        console.log('Environment load error: ', err);
      });
  };
  connectionSave = () => {
    axios
      .post(
        `http://localhost:5000/api/valuefinder/setEnvironment/${this.state.processValue}/QUEUE_CONNECTION_STRING/${this.state.envData.QUEUE_CONNECTION_STRING}`
      )
      .then(res => {
        this.setState({ connectionEdit: false });
        message.success('Data updated successfully');
      })
      .catch(err => {
        message.error('Error in data update');
        console.log('Environment load error: ', err);
      });
  };

  render() {
    return (
      <React.Fragment>
        <div
          style={{
            display: 'flex',
            alignContent: 'center',
            alignContent: 'center',
            marginTop: 30
          }}
        >
          <Select
            defaultValue='PROCESS1'
            style={{ width: 150 }}
            onChange={this.handleChange}
          >
            <Option value='PROCESS1'>PROCESS1</Option>
            <Option value='PROCESS2'>PROCESS2</Option>
          </Select>
          <Button
            type='primary'
            onClick={this.getDetails}
            style={{ marginLeft: 20 }}
          >
            Get Details
          </Button>
        </div>
        <br />
        {this.state.envData ? (
          <table className='table'>
            <thead>
              <tr className='header'>
                <th>DATABASE HOST</th>
                <th>DATABASE PASSWORD</th>
                <th>CONNECTION STRING</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {this.state.hostEdit ? (
                  <td>
                    <input
                      type='text'
                      onChange={this.onTextChange}
                      name='DATABASE_HOST'
                      value={this.state.envData.DATABASE_HOST}
                    />
                    <Icon type='save' onClick={this.hostSave} />
                  </td>
                ) : (
                  <td>
                    {this.state.envData.DATABASE_HOST}
                    <Icon
                      type='edit'
                      onClick={() => this.setState({ hostEdit: true })}
                    />
                  </td>
                )}
                {this.state.passwordEdit ? (
                  <td>
                    <input
                      type='text'
                      onChange={this.onTextChange}
                      name='DATABASE_PASSWORD'
                      value={this.state.envData.DATABASE_PASSWORD}
                    />
                    <Icon type='save' onClick={this.passwordSave} />
                  </td>
                ) : (
                  <td>
                    {this.state.envData.DATABASE_PASSWORD}
                    <Icon
                      type='edit'
                      onClick={() => this.setState({ processEdit: true })}
                    />
                  </td>
                )}
                {this.state.connectionEdit ? (
                  <td>
                    <input
                      type='text'
                      onChange={this.onTextChange}
                      name='QUEUE_CONNECTION_STRING'
                      value={this.state.envData.QUEUE_CONNECTION_STRING}
                    />
                    <Icon type='save' onClick={this.connectionSave} />
                  </td>
                ) : (
                  <td>
                    {this.state.envData.QUEUE_CONNECTION_STRING}
                    <Icon
                      type='edit'
                      onClick={() => this.setState({ connectionEdit: true })}
                    />
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        ) : null}
      </React.Fragment>
    );
  }
}

export default ProcessConfigDetails;
