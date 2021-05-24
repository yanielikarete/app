import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { Route, useHistory } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { AppTopbar } from './AppTopbar';
import { AppFooter } from './AppFooter';
import { AppMenu } from './AppMenu';
import { AppProfile } from './AppProfile';
import { AppConfig } from './AppConfig';

import { Dashboard } from './components/Dashboard';
import { ButtonDemo } from './components/ButtonDemo';
import { ChartDemo } from './components/ChartDemo';
import { Documentation } from './components/Documentation';
import { FileDemo } from './components/FileDemo';
import { FloatLabelDemo } from './components/FloatLabelDemo';
import { FormLayoutDemo } from './components/FormLayoutDemo';
import { InputDemo } from './components/InputDemo';
import { ListDemo } from './components/ListDemo';
import { MenuDemo } from './components/MenuDemo';
import { MessagesDemo } from './components/MessagesDemo';
import { MiscDemo } from './components/MiscDemo';
import { OverlayDemo } from './components/OverlayDemo';
import { PanelDemo } from './components/PanelDemo';
import { TableDemo } from './components/TableDemo';
import { TreeDemo } from './components/TreeDemo';
import { InvalidStateDemo } from './components/InvalidStateDemo';

import { Calendar } from './pages/Calendar';
import { Crud } from './pages/Crud';
import { EmptyPage } from './pages/EmptyPage';

import { DisplayDemo } from './utilities/DisplayDemo';
import { ElevationDemo } from './utilities/ElevationDemo';
import { FlexBoxDemo } from './utilities/FlexBoxDemo';
import { GridDemo } from './utilities/GridDemo';
import { IconsDemo } from './utilities/IconsDemo';
import { SpacingDemo } from './utilities/SpacingDemo';
import { TextDemo } from './utilities/TextDemo';
import { TypographyDemo } from './utilities/TypographyDemo';
import { TimelineDemo } from './utilities/TimelineDemo';

import PrimeReact from 'primereact/api';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import './layout/flags/flags.css';
import './layout/layout.scss';
import './App.scss';
import UsuariosData from './components/Configuracion/UsuariosData';
import Empresas from './components/Configuracion/Empresas';

const App = () => {

    const [layoutMode, setLayoutMode] = useState('static');
    const [layoutColorMode, setLayoutColorMode] = useState('dark')
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [inputStyle, setInputStyle] = useState('outlined');
    const [ripple, setRipple] = useState(false);
    const sidebar = useRef();

    const history = useHistory();

    let menuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, 'body-overflow-hidden');
        }
        else {
            removeClass(document.body, 'body-overflow-hidden');
        }
    }, [mobileMenuActive]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    }

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value)
    }

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode)
    }

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode)
    }

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
        menuClick = false;
    }

    const onToggleMenu = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === 'overlay') {
                setOverlayMenuActive(prevState => !prevState);
            }
            else if (layoutMode === 'static') {
                setStaticMenuInactive(prevState => !prevState);
            }
        }
        else {
            setMobileMenuActive(prevState => !prevState);
        }
        event.preventDefault();
    }

    const onSidebarClick = () => {
        menuClick = true;
    }

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    }

    const menu = [
        {
           label:'Documentos Electronicos',
           icon:'pi pi-fw pi-file',           
           items:[
              {
                 label:'Emisión / Ingreso',
               //   icon:'pi pi-fw pi-plus',
               icon: 'pi pi-fw',
                 items:[
                    {
                       label:'Factura',
                       icon:'pi pi-fw pi-file',
                       url: '/facturas'
                    },
                    {
                     label:'Guia de Remisión',
                     icon:'pi pi-fw pi-file',
                     url: '/remision'
                  },
                  {
                     label:'Retención',
                     icon:'pi pi-fw pi-file'
                  },
                  {
                     label:'Nota de crédito',
                     icon:'pi pi-fw pi-file'
                  },
                  {
                     label:'Nota de débito',
                     icon:'pi pi-fw pi-file'
                  },
                  {
                     label:'Retencion Recibida',
                     icon:'pi pi-fw pi-file'
                  },
                  {
                     label:'Cotización',
                     icon:'pi pi-fw pi-file'
                  },
                  {
                     label:'Liquidación de Compras',
                     icon:'pi pi-fw pi-file'
                  },
                  {
                     label:'Factura de Compra',
                     icon:'pi pi-fw pi-file'
                  },
                  {
                     label:'Factura de Gasto',
                     icon:'pi pi-fw pi-file'
                  }
                 ]
              },
              {
               label:'Historial',
             //   icon:'pi pi-fw pi-plus',
             icon: 'pi pi-fw',
               items:[
                  {
                     label:'Factura',
                     icon:'pi pi-fw pi-clock'
                  },
                  {
                   label:'Guia de Remisión',
                   icon:'pi pi-fw pi-clock'
                },
                {
                   label:'Retención',
                   icon:'pi pi-fw pi-clock'
                },
                {
                   label:'Nota de crédito',
                   icon:'pi pi-fw pi-clock'
                },
                {
                   label:'Nota de débito',
                   icon:'pi pi-fw pi-clock'
                },
                {
                   label:'Retencion Recibida',
                   icon:'pi pi-fw pi-clock'
                },
                {
                   label:'Cotización',
                   icon:'pi pi-fw pi-clock'
                },
                {
                   label:'Liquidación de Compras',
                   icon:'pi pi-fw pi-clock'
                },
                {
                   label:'Factura de Compra',
                   icon:'pi pi-fw pi-clock'
                },
                {
                   label:'Factura de Gasto',
                   icon:'pi pi-fw pi-clock'
                }
               ]
            }
           ]
        },
        {
           label:'Abonos',
           icon:'pi pi-fw pi-money-bill',
           items:[
              {
                 label:'Factura',
                 icon:'pi pi-fw pi-file'
              },
              {
                 label:'Nota de Crédito',
                 icon:'pi pi-fw pi-file'
              },
              {
                 label:'Nota de Débito',
                 icon:'pi pi-fw pi-file'
              },
              {
                 label:'Facturas de Compras',
                 icon:'pi pi-fw pi-file'
              },
              {
               label:'Liquidaciones de Compras',
               icon:'pi pi-fw pi-file'
               },
               {
                  label:'Facturas de Gastos',
                  icon:'pi pi-fw pi-file'
               }
           ]
        },
        {
           label:'Banca',
           icon:'pi pi-fw pi-wallet',
           items:[
              {
                 label:'New',
                 icon:'pi pi-fw pi-wallet'
              },
              {
                 label:'Operaciones Bancarias',
                 icon:'pi pi-fw pi-sort-numeric-up-alt'
              },
              {
                  label:'Reporte de Operaciones',
                  icon:'pi pi-fw pi-file-excel'
              }
           ]
        },
        {
           label:'Préstamos',
           icon:'pi pi-fw pi-dollar',
           items:[
               {
                  label:'Ingresar Préstamo',
                  icon:'pi pi-fw pi-plus'
               },
               {
                  label:'Abonos de préstamos',
                  icon:'pi pi-fw pi-money-bill'
               },
               {
                   label:'Reporte de Préstamos por Cobrar',
                   icon:'pi pi-fw pi-file-excel'
               }
           ]
        },
        {
            label:'Inventarios',
            icon:'pi pi-fw pi-book',
            items:[
               {
                  label:'Producto',
                  icon:'pi pi-fw pi-globe'
               },
               {
                  label:'Reporte de productos',
                  icon:'pi pi-fw pi-file-pdf'
               }
            ]
         },
         {
            label:'Cartera',
            icon:'pi pi-fw pi-briefcase',
            items:[
                {
                   label:'Clientes',
                   icon:'pi pi-fw pi-users'
                },
                {
                   label:'Proveedores',
                   icon:'pi pi-fw pi-users'
                },
                {
                    label:'Transportistas',
                    icon:'pi pi-fw pi-directions'
                }
            ]
         },
         {
            label:'Configuración',
            icon:'pi pi-fw pi-cog',
            items:[
                {
                   label:'Usuarios',
                   icon:'pi pi-fw pi-users',
                   to: '/usuarios'
                },
                {
                   label:'Empresas',
                   icon:'pi pi-fw pi-home',
                   to: '/empresa'
                },
                {
                    label:'Establecimientos',
                    icon:'pi pi-fw pi-microsoft',
                    to: '/establecimientos'
                },
                {
                  label:'Puntos de Emisión',
                  icon:'pi pi-fw pi-th-large',
                  url: '/ptosEmision'
                },
                {
                  label:'Firma Digital',
                  icon:'pi pi-fw pi-key',
                  url: '/firma'
                },
                {
                  label:'Secuenciales',
                  icon:'pi pi-fw pi-sort-alpha-down'
                }
            ]
         }
     ];

    const addClass = (element, className) => {
        if (element.classList)
            element.classList.add(className);
        else
            element.className += ' ' + className;
    }

    const removeClass = (element, className) => {
        if (element.classList)
            element.classList.remove(className);
        else
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    const isDesktop = () => {
        return window.innerWidth > 1024;
    }

    const isSidebarVisible = () => {
        if (isDesktop()) {
            if (layoutMode === 'static')
                return !staticMenuInactive;
            else if (layoutMode === 'overlay')
                return overlayMenuActive;
            else
                return true;
        }

        return true;
    }

    const logo = layoutColorMode === 'dark' ? 'assets/layout/images/logo-white.svg' : 'assets/layout/images/logo.svg';

    const wrapperClass = classNames('layout-wrapper', {
        'layout-overlay': layoutMode === 'overlay',
        'layout-static': layoutMode === 'static',
        'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
        'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
        'layout-mobile-sidebar-active': mobileMenuActive,
        'p-input-filled': inputStyle === 'filled',
        'p-ripple-disabled': ripple === false
    });

    const sidebarClassName = classNames('layout-sidebar', {
        'layout-sidebar-dark': layoutColorMode === 'dark',
        'layout-sidebar-light': layoutColorMode === 'light'
    });

    return (
        <div className={wrapperClass} onClick={onWrapperClick}>
            <AppTopbar onToggleMenu={onToggleMenu} />

            <CSSTransition classNames="layout-sidebar" timeout={{ enter: 200, exit: 200 }} in={isSidebarVisible()} unmountOnExit>
                <div ref={sidebar} className={sidebarClassName} onClick={onSidebarClick}>
                    <div className="layout-logo" style={{cursor: 'pointer'}} onClick={() => history.push('/')}>
                        <img alt="Logo" src={logo} />
                    </div>
                    <AppProfile />
                    <AppMenu model={menu} onMenuItemClick={onMenuItemClick} />
                </div>
            </CSSTransition>

            <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange}
                layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />

            <div className="layout-main">
                <Route path="/" exact component={Dashboard} />
                <Route path="/formlayout" component={FormLayoutDemo} />
                <Route path="/input" component={InputDemo} />
                <Route path="/floatlabel" component={FloatLabelDemo} />
                <Route path="/invalidstate" component={InvalidStateDemo} />
                <Route path="/button" component={ButtonDemo} />
                <Route path="/table" component={TableDemo} />
                <Route path="/list" component={ListDemo} />
                <Route path="/tree" component={TreeDemo} />
                <Route path="/panel" component={PanelDemo} />
                <Route path="/overlay" component={OverlayDemo} />
                <Route path="/menu" component={MenuDemo} />
                <Route path="/messages" component={MessagesDemo} />
                <Route path="/file" component={FileDemo} />
                <Route path="/chart" component={ChartDemo} />
                <Route path="/misc" component={MiscDemo} />
                <Route path="/display" component={DisplayDemo} />
                <Route path="/elevation" component={ElevationDemo} />
                <Route path="/flexbox" component={FlexBoxDemo} />
                <Route path="/icons" component={IconsDemo} />
                <Route path="/grid" component={GridDemo} />
                <Route path="/spacing" component={SpacingDemo} />
                <Route path="/typography" component={TypographyDemo} />
                <Route path="/text" component={TextDemo} />
                <Route path="/calendar" component={Calendar} />
                <Route path="/timeline" component={TimelineDemo} />
                <Route path="/crud" component={Crud} />
                <Route path="/empty" component={EmptyPage} />
                <Route path="/documentation" component={Documentation} />
                <Route path="/usuarios">
                    <UsuariosData header="Manejar Usuarios" title="Usuarios" sing="Usuario" />
                </Route>
                <Route path="/empresa" component={Empresas} />
                <Route path="/establecimientos">
                    <UsuariosData header="Manejar Establecimientos" title="Establecimientos" sing="Establecimiento" />
                </Route>
                {/* <Route path="/*" component={NotFound} /> */}
            </div>

            <AppFooter />

        </div>
    );

}

export default App;
