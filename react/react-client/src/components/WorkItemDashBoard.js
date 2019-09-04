import React from 'react';
import axios from 'axios';
import {
  Table,
  Input,
  Button,
  Popconfirm,
  Form,
  InputNumber,
  Select,
  message,
  Modal
} from 'antd';

import moment from 'moment';

import 'antd/dist/antd.css';

const { Option } = Select;

const EditableContext = React.createContext();

const dateFormat = 'YYYY/MM/DD';

class EditableCell extends React.Component {
  getInput = () => {
    console.log('Input type:', this.props.inputType);

    if (this.props.inputType === 'select') {
      return (
        <Select defaultValue='lucy' style={{ width: 120 }}>
          <Option value='overdue'>Overdue</Option>

          <Option value='done'>Done</Option>

          <Option value='inprogress'>InProgress</Option>
        </Select>
      );
    }

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

class EditableTable extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [
      {
        title: 'ID',

        dataIndex: 'key',

        editable: false
      },

      {
        title: 'WorkItem',

        dataIndex: 'workitem',

        width: '30%',

        editable: true
      },

      {
        title: 'DueDate',

        dataIndex: 'duedate',

        editable: true
      },

      {
        title: 'No of Resource Needed',

        dataIndex: 'noofresource',

        editable: true
      },

      {
        title: 'Status',

        dataIndex: 'status',

        editable: true
      },

      {
        title: 'operation',

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
            <span>
              <a
                disabled={editingKey !== ''}
                onClick={() => this.edit(record.key)}
              >
                Edit
              </a>

              <Popconfirm
                title='Sure to delete?'
                onConfirm={() => this.handleDelete(record.key)}
              >
                <a style={{ marginLeft: 10 }}>Delete</a>
              </Popconfirm>
            </span>
          );
        }
      }
    ];

    this.state = {
      dataSource: [],

      editingKey: '',

      addNew: false,

      newWorkItem: {}
    };
  }

  isEditing = record => record.key === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, key) {
    console.log('save data called');

    form.validateFields((error, row) => {
      if (error) {
        return;
      }

      const newData = [...this.state.dataSource];

      const index = newData.findIndex(item => key === item.key);

      if (index > -1) {
        const item = newData[index];

        newData.splice(index, 1, {
          ...item,

          ...row
        });

        this.setState({ dataSource: newData, editingKey: '' });
      } else {
        newData.push(row);

        this.setState({ dataSource: newData, editingKey: '' });
      }
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  handleAdd = () => {
    this.setState({ addNew: true });
  };

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];

    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };

  handleSaveNewWorkItem = e => {
    console.log(e);

    this.setState({
      addNew: false
    });

    var newItem = {
      ...this.state.newWorkItem,
      key: this.state.dataSource.length,
      status: 'pending'
    };

    console.log('new item:', newItem);

    this.setState({
      dataSource: [...this.state.dataSource, newItem],
      newWorkItem: {}
    });
  };

  handleCancelNewWorkItem = e => {
    console.log(e);

    this.setState({
      addNew: false,

      newWorkItem: {}
    });
  };

  newWorkItemChangeHandler = e => {
    console.log('target:', e.target.name);

    this.setState({
      newWorkItem: {
        ...this.state.newWorkItem,

        [e.target.name]: e.target.value
      }
    });
  };

  uploadToGoogle = () => {
    axios
      .post(
        'http://localhost:5000/api/accessgooglesheet/createGoogleSheet',
        this.state.dataSource
      )
      .then(res => {
        message.success('Data uploaded successfully');
      })
      .catch(err => {
        message.error('Error in data upload');
      });
  };
  render() {
    const { dataSource } = this.state;

    const components = {
      body: {
        cell: EditableCell
      }
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,

        onCell: record => ({
          record,

          inputType: col.dataIndex === 'status' ? 'select' : 'text',

          dataIndex: col.dataIndex,

          title: col.title,

          editing: this.isEditing(record)
        })
      };
    });

    return (
      <React.Fragment>
        <div className='actionHeader'>
          <Button
            onClick={this.handleAdd}
            type='primary'
            style={{ margin: 10 }}
          >
            Add new
          </Button>

          <Button
            type='primary'
            icon='upload'
            style={{ margin: 10 }}
            onClick={this.uploadToGoogle}
          >
            Upload to Spreadsheet
          </Button>

          <Button type='primary' style={{ margin: 10 }}>
            No of work item: {this.state.dataSource.length}
          </Button>
        </div>

        <Modal
          title='Add new work item'
          visible={this.state.addNew}
          onOk={this.handleSaveNewWorkItem}
          onCancel={this.handleCancelNewWorkItem}
        >
          <Form layout='vertical'>
            <Form.Item label='Work Item:'>
              <Input
                name='workitem'
                value={this.state.newWorkItem.workitem}
                onChange={this.newWorkItemChangeHandler}
              />
            </Form.Item>

            <Form.Item label='Due Date:'>
              <Input
                name='duedate'
                value={this.state.newWorkItem.duedate}
                onChange={this.newWorkItemChangeHandler}
              />
            </Form.Item>

            <Form.Item label='No. of Reqource Needed:'>
              <Input
                name='noofresource'
                value={this.state.newWorkItem.noofresource}
                onChange={this.newWorkItemChangeHandler}
              />
            </Form.Item>
          </Form>
        </Modal>

        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={this.state.dataSource}
            columns={columns}
            style={{ width: '100%' }}
            footer={this.state.addNew ? this.footer : null}
          />
        </EditableContext.Provider>
      </React.Fragment>
    );
  }
}

const Workitem = Form.create()(EditableTable);

export default Workitem;
