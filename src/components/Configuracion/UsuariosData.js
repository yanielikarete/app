import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ServiceApp } from '../../service/ServiceApp';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import './UsuariosData.css';

const UsuariosData = (props) => {

  let emptyUser = {
    id: null,
    name: '',
    image: null,
    description: '',
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: 'INSTOCK'
  };
  console.log(props)
  const [users, setUsers] = useState(null);
  const [userDialog, setUserDialog] = useState(false);
  const [deleteUserDialog, setDeleteUserDialog] = useState(false);
  const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
  const [user, setUser] = useState(emptyUser);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const toast = useRef(null);
  const dt = useRef(null);
  let serviceApp = ServiceApp.getInstance();

  useEffect(() => {
    serviceApp.getAllUsuarios().then(data => { setUsers(data); setIsLoading(false) });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // const formatCurrency = (value) => {
  //   return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  // }

  const openNew = () => {
    setUser(emptyUser);
    setSubmitted(false);
    setUserDialog(true);
  }

  const hideDialog = () => {
    setSubmitted(false);
    setUserDialog(false);
  }

  const hideDeleteUserDialog = () => {
    setDeleteUserDialog(false);
  }

  const hideDeleteUsersDialog = () => {
    setDeleteUsersDialog(false);
  }

  const saveUser = () => {
    setSubmitted(true);

    if (user.name.trim()) {
      let _users = [...users];
      let _user = { ...user };
      if (user.id) {
        const index = findIndexById(user.id);

        _users[index] = _user;
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
      }
      else {
        _user.id = createId();
        _user.image = 'user-placeholder.svg';
        _users.push(_user);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
      }

      setUsers(_users);
      setUserDialog(false);
      setUser(emptyUser);
    }
  }

  const editUser = (user) => {
    setUser({ ...user });
    setUserDialog(true);
  }

  const confirmDeleteUser = (user) => {
    setUser(user);
    setDeleteUserDialog(true);
  }

  const deleteUser = () => {
    let _users = users.filter(val => val.id !== user.id);
    setUser(_users);
    setDeleteUserDialog(false);
    setUser(emptyUser);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
  }

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  const createId = () => {
    let id = '';
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  const exportCSV = () => {
    dt.current.exportCSV();
  }

  const confirmDeleteSelected = () => {
    setDeleteUsersDialog(true);
  }

  const deleteSelectedUsers = () => {
    let _users = users.filter(val => !selectedUsers.includes(val));
    setUsers(_users);
    setDeleteUsersDialog(false);
    setSelectedUsers(null);
    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
  }

  const onCategoryChange = (e) => {
    let _user = { ...user };
    _user['category'] = e.value;
    setUser(_user);
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _user = { ...user };
    _user[`${name}`] = val;

    setUser(_user);
  }

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _user = { ...user };
    _user[`${name}`] = val;

    setUser(_user);
  }

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label={"Nuevo " + props.sing} icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
        <Button label={"Eliminar " + props.sing} icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedUsers || !selectedUsers.length} />
      </React.Fragment>
    )
  }

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Importar" className="p-mr-2 p-d-inline-block" />
        <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
      </React.Fragment>
    )
  }



  const ratingBodyTemplate = (rowData) => {
    return <Rating value={rowData.rating} readOnly cancel={false} />;
  }

  // const statusBodyTemplate = (rowData) => {
  //   return <span className={`user-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>;
  // }

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editUser(rowData)} />
        <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteUser(rowData)} />
      </React.Fragment>
    );
  }

  const header = (
    <div className="table-header">
      <h5 className="p-m-0">{props.header}</h5>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="Buscar" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
      </span>
    </div>
  );
  const userDialogFooter = (
    <React.Fragment>
      <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveUser} />
    </React.Fragment>
  );
  const deleteUserDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUserDialog} />
      <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteUser} />
    </React.Fragment>
  );
  const deleteUsersDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUsersDialog} />
      <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedUsers} />
    </React.Fragment>
  );

  return (
      <>
      <h1>{props.title}</h1>     

    <div className="datatable-crud-demo">
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="p-mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

        <DataTable ref={dt} value={users} selection={selectedUsers} onSelectionChange={(e) => setSelectedUsers(e.value)}
          dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
          globalFilter={globalFilter}
          header={header}
          loading={isLoading}>

          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
          <Column field="firstname" header="Nombre" sortable></Column>
          <Column field="lastName" header="Apellidos" sortable></Column>
          <Column field="username" header="Usuario" sortable></Column>
          <Column field="email" header="Correo" sortable></Column>
        
          <Column field="rating" header="Estado" body={ratingBodyTemplate} sortable></Column>
          {/* <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable></Column> */}
          <Column body={actionBodyTemplate}></Column>
        </DataTable>
      </div>

      <Dialog visible={userDialog} style={{ width: '450px' }} header="User Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
        {user.image && <img src={`showcase/demo/images/user/${user.image}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={user.image} className="user-image" />}
        <div className="p-field">
          <label htmlFor="name">Name</label>
          <InputText id="name" value={user.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.name })} />
          {submitted && !user.name && <small className="p-error">Name is required.</small>}
        </div>
        <div className="p-field">
          <label htmlFor="description">Description</label>
          <InputTextarea id="description" value={user.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
        </div>

        <div className="p-field">
          <label className="p-mb-3">Category</label>
          <div className="p-formgrid p-grid">
            <div className="p-field-radiobutton p-col-6">
              <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={user.category === 'Accessories'} />
              <label htmlFor="category1">Accessories</label>
            </div>
            <div className="p-field-radiobutton p-col-6">
              <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={user.category === 'Clothing'} />
              <label htmlFor="category2">Clothing</label>
            </div>
            <div className="p-field-radiobutton p-col-6">
              <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={user.category === 'Electronics'} />
              <label htmlFor="category3">Electronics</label>
            </div>
            <div className="p-field-radiobutton p-col-6">
              <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={user.category === 'Fitness'} />
              <label htmlFor="category4">Fitness</label>
            </div>
          </div>
        </div>

        <div className="p-formgrid p-grid">
          <div className="p-field p-col">
            <label htmlFor="price">Price</label>
            <InputNumber id="price" value={user.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
          </div>
          <div className="p-field p-col">
            <label htmlFor="quantity">Quantity</label>
            <InputNumber id="quantity" value={user.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} integeronly />
          </div>
        </div>
      </Dialog>

      <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          {user && <span>Are you sure you want to delete <b>{user.name}</b>?</span>}
        </div>
      </Dialog>

      <Dialog visible={deleteUsersDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUsersDialogFooter} onHide={hideDeleteUsersDialog}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
          {user && <span>Are you sure you want to delete the selected users?</span>}
        </div>
      </Dialog>
    </div>
    </>
  );
}

export default UsuariosData