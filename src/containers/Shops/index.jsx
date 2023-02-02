/** @format */

import React, { Component } from 'react';

var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

class ShopList extends Component {
  componentDidMount = () => {
    if (window.ShopifyBuy) {
      if (window.ShopifyBuy.UI) {
        this.ShopifyBuyInit();
      } else {
        this.loadScript();
      }
    } else {
      this.loadScript();
    }
  };
  loadScript = () => {
    var script = document.createElement('script');
    script.async = true;
    script.src = scriptURL;
    (
      document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]
    ).appendChild(script);
    script.onload = this.ShopifyBuyInit;
  };
  ShopifyBuyInit = () => {
    var client = window.ShopifyBuy.buildClient({
      domain: process.env.REACT_APP_SHOPIFY_DOMAIN,
      storefrontAccessToken: process.env.REACT_APP_SHOPIFY_ACCESS_TOKEN
    });
    window.ShopifyBuy.UI.onReady(client).then(function (ui) {
      ui.createComponent('collection', {
        id: '262795133101',
        node: document.getElementById('collection-component-1617720897870'),
        moneyFormat: '%24%7B%7Bamount%7D%7D',
        options: {
          product: {
            styles: {
              product: {
                '@media (min-width: 601px)': {
                  'max-width': 'calc(25% - 20px)',
                  'margin-left': '20px',
                  'margin-bottom': '50px',
                  width: 'calc(25% - 20px)'
                },
                img: {
                  height: 'calc(100% - 15px)',
                  position: 'absolute',
                  left: '0',
                  right: '0',
                  top: '0'
                },
                imgWrapper: {
                  'padding-top': 'calc(75% + 15px)',
                  position: 'relative',
                  height: '0'
                }
              },
              button: {
                color: '#fff',
                border: '1px solid #f485ab',
                'border-radius': '35px',
                padding: '14px 25px 14px 25px',
                'min-width': '180px',
                'font-size': '20px',
                'font-family': 'Playfair Display, sans-serif',
                background: '#f485ab',
                transition: 'all 0.3s ease',
                ':hover': {
                  color: '#000000',
                  background: '#ffffff',
                  'border-color': '#f485ab'
                },
                ':focus': {
                  color: '#000000',
                  background: '#ffffff',
                  'border-color': '#f485ab'
                },
                ':disabled': {
                  border: 'none'
                }
              }
            },
            text: {
              button: 'Add to cart'
            }
          },
          productSet: {
            styles: {
              products: {
                '@media (min-width: 601px)': {
                  'margin-left': '-20px'
                }
              }
            }
          },
          modalProduct: {
            contents: {
              img: false,
              imgWithCarousel: true,
              button: false,
              buttonWithQuantity: true
            },
            styles: {
              product: {
                '@media (min-width: 601px)': {
                  'max-width': '100%',
                  'margin-left': '0px',
                  'margin-bottom': '0px'
                }
              },
              button: {
                'font-family': 'Playfair Display, sans-serif',
                'border-radius': '4px'
              }
            },
            text: {
              button: 'Add to cart'
            }
          },
          option: {},
          cart: {
            styles: {
              button: {
                'font-family': 'Playfair Display, sans-serif',
                'border-radius': '4px'
              }
            },
            text: {
              total: 'Subtotal',
              button: 'Checkout'
            }
          },
          toggle: {
            styles: {
              toggle: {
                'font-family': 'Playfair Display, sans-serif'
              }
            }
          }
        }
      });
    });
  };
  render() {
    return (
      <div className="shop-page-wrapper">
        <div className="container">
          <div className="section-title text-center">
            <h2>
              <span className="small-text-bg">Shop</span>
            </h2>
          </div>
          <div id="collection-component-1617720897870"></div>
        </div>
      </div>
    );
  }
}

export default ShopList;
