<template>
    <div>
        <nav-header></nav-header>
        <nav-bread>
            <span>Goods</span>
        </nav-bread>
        <div class="accessory-result-page accessory-page">
            <div class="container">
                <div class="filter-nav">
                    <span class="sortby">Sort by:</span>
                    <a href="javascript:void(0)" class="default cur">Default</a>
                    <a href="javascript:void(0)" class="price">Price
                        <svg class="icon icon-arrow-short">
                            <use xlink:href="#icon-arrow-short"></use>
                        </svg>
                    </a>
                    <a href="javascript:void(0)"
                       class="filterby stopPop"
                       @click="showFilterPop">
                        Filter by
                    </a>
                </div>
                <div class="accessory-result">
                    <!-- filter -->
                    <div class="filter stopPop"
                         id="filter"
                         :class="{'filterby-show':filterBy}">
                        <dl class="filter-price">
                            <dt>Price:</dt>
                            <dd>
                                <a href="javascript:void(0)"
                                   :class="{ 'cur' : priceChecked==='all'}"
                                   @click="priceChecked='all'">All
                                </a>
                            </dd>
                            <dd v-for="(price,index) in priceFilter"
                                :key="index">
                                <a href="javascript:void(0)"
                                   :class="{'cur':priceChecked===index}"
                                   @click="setPriceFilter(index)"
                                >
                                    {{price.startPrice}}- {{price.endPrice}}
                                </a>
                            </dd>
                        </dl>
                    </div>
                    <!-- search result accessories list -->
                    <div class="accessory-list-wrap">
                        <div class="accessory-list col-4">
                            <ul>
                                <li v-for="(item,index) in goodsList" :key="index">
                                    <div class="pic">
                                        <a href="#">
                                            <img v-lazy="'/static/'+item.productImage" alt="" >
                                        </a>
                                    </div>
                                    <div class="main">
                                        <div class="name">{{item.productName}}</div>
                                        <div class="price">{{item.productPrice}}</div>
                                        <div class="btn-area">
                                            <a href="javascript:;" class="btn btn--m">加入购物车</a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="md-overlay" v-show="overLayFlag" @click="closeFilterPop"></div>
        <nav-footer></nav-footer>
    </div>
</template>

<script>
import '../assets/css/base.css'
import './../assets/css/product.css'
import NavHeader from '../components/NavHeader'
import NavFooter from '../components/NavFooter'
import NavBread from '../components/NavBread'
import axios from 'axios'

export default {
  name: 'GoodsList',
  data () {
    return {
      goodsList: [],
      priceFilter: [
        {
          startPrice: '0',
          endPrice: '500'
        },
        {
          startPrice: '500',
          endPrice: '1000'
        },
        {
          startPrice: '1000',
          endPrice: '2000'
        },
        {
          startPrice: '2000',
          endPrice: '3000'
        }
      ],
      priceChecked: 'all',
      filterBy: false,
      overLayFlag: false
    }
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread
  },
  methods: {
    getGoodsList () {
      // axios.get('/static/mock/goods.json').then((result) => {
      axios.get('/goods').then((result) => {
        const res = result.data
        this.goodsList = res.result.list
      })
    },
    showFilterPop () {
      this.filterBy = true
      this.overLayFlag = true
    },
    closeFilterPop () {
      this.filterBy = false
      this.overLayFlag = false
    },
    setPriceFilter (index) {
      this.priceChecked = index
      this.closeFilterPop()
    }
  },
  mounted () {
    this.getGoodsList()
  }

}
</script>
