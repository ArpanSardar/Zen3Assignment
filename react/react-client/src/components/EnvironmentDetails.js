import React, { Component } from 'react';
import axios from 'axios';
import { Select, Button, Table, Popconfirm, Form, Input } from 'antd';
// import EditableCell from './EditableCell';
import 'antd/dist/antd.css';

const { Option } = Select;
const EditableContext = React.createContext();

class EditableCell extends Component {
  getInput = () => {
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`
                }
              ],
              initialValue: record[dataIndex]
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return (
      <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
    );
  }
}

class EnvironmentTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      envData: null,
      editingKey: '',
      processValue: 'PROCESS1'
    };

    this.Columns = [
      {
        title: 'DATABASE HOST',
        dataIndex: 'DATABASE_HOST',
        key: 'DATABASE_HOST',
        editable: true
      },
      {
        title: 'DATABASE PASSWORD',
        dataIndex: 'DATABASE_PASSWORD',
        key: 'DATABASE_PASSWORD',
        editable: true
      },
      {
        title: 'CONNECTION STRING',
        dataIndex: 'QUEUE_CONNECTION_STRING',
        key: 'QUEUE_CONNECTION_STRING',
        editable: true
      },
      {
        title: 'OPERATION',
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a
                    onClick={() => this.save(form, record.key)}
                    style={{ marginRight: 8 }}
                  >
                    Save
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm
                title='Sure to cancel?'
                onConfirm={() => this.cancel(record.key)}
              >
                <a>Cancel</a>
              </Popconfirm>
            </span>
          ) : (
            <a
              disabled={editingKey !== ''}
              onClick={() => this.edit(record.key)}
            >
              Edit
            </a>
          );
        }
      }
    ];
  }
  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };
  edit(key) {
    console.log('key:', this.state.envData);
    this.setState({ editingKey: key });
  }
  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.envData];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        // axios
        // .post(
        //   `http://localhost:5000/api/valuefinder/setEnvironment/${this.state.processValue}/${}/${}`
        // )
        // .then(res => {
        //   this.setState({ envData: newData, editingKey: '' });
        //         })
        // .catch(err => {
        //   console.log('Environment load error: ', err);
        // });
        this.setState({ envData: newData, editingKey: '' });
      } else {
        newData.push(row);
        this.setState({ envData: newData, editingKey: '' });
      }
    });
  }
  handleChange = value => {
    this.setState({ processValue: value });
  };
  getDetails = () => {
    axios
      .get(
        `http://localhost:5000/api/valuefinder/getEnvironment/${this.state.processValue}`
      )
      .then(res => {
        this.setState({ envData: [Object.assign(res.data, { key: 1 })] });
      })
      .catch(err => {
        console.log('Environment load error: ', err);
      });
  };
  render() {
    const components = {
      body: {
        cell: EditableCell
      }
    };
    const columns = this.Columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record)
        })
      };
    });
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
        {/* <Table
          style={{ marginTop: 30 }}
          dataSource={[this.state.envData]}
          columns={columns}
          pagination={false}
        /> */}
        {this.state.envData ? (
          <EditableContext.Provider value={this.props.form}>
            <Table
              components={components}
              bordered
              dataSource={this.state.envData ? this.state.envData : []}
              columns={columns}
              rowClassName='editable-row'
              pagination={false}
            />
          </EditableContext.Provider>
        ) : null}
      </React.Fragment>
    );
  }
}
const EnvironmentDetails = Form.create()(EnvironmentTable);

export default EnvironmentDetails;
