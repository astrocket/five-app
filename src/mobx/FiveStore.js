import { observable, action, autorun } from 'mobx';
import axios from 'axios';
import * as ApiServer from '../config/ApiServer';
import * as Constant from '../config/Constant';
import StoreBase from './StoreBase';
import { Toast } from "native-base";

class FiveStore extends StoreBase {

  constructor(app) {
    super();
    this.app = app;
    autorun(() => {
      this.header = {
        headers: { 'X-User-Email': app.email, 'X-User-Token': app.token },
      };
      this.formHeader = {
        headers: { 'X-User-Email': app.email, 'X-User-Token': app.token, 'Content-Type': 'multipart/form-data;' },
      };
      this.categories = app.categories;
    });
  }

  @action // function that immediately changes store data.
  doNothing() {}

  methodsPerApi(category, modalNavigation) {
    switch (category) {
      case 'restaurant':
        return {
          add_five_api: (c,i,n,s,f) => this.addFiveRestaurant(c,i,n,s,f),
          add_wish_api: (c,i,n) => this.addWishRestaurant(c,i,n),
          onclick_image: (i) => modalNavigation.navigate('Map', { lng: i.x, lat: i.y, title: this.namesPerApi(i), }),
          next_page: (i,p,cs,sS) => this.nextPageRestaurant(i,p,cs,sS),
          search_api: (i,p,sS) => this.searchApiRestaurant(i,p,sS),
        };
      case 'music':
        return {
          add_five_api: (c,i,n,s,f) => this.addFiveMusic(c,i,n,s,f),
          add_wish_api: (c,i,n) => this.addWishMusic(c,i,n),
          onclick_image: (i) => modalNavigation.navigate('ModalWebViewShow', { title: this.namesPerApi(i), url: (i.related_link || i.track_share_url.split('?')[0]) }),
          next_page: (i,p,cs,sS) => this.nextPageMusic(i,p,cs,sS),
          search_api: (i,p,sS) => this.searchApiMusic(i,p,sS),
        };
      case 'book':
        return {
          add_five_api: (c,i,n,s,f) => this.addFiveBook(c,i,n,s,f),
          add_wish_api: (c,i,n) => this.addWishBook(c,i,n),
          onclick_image: (i) => modalNavigation.navigate('ModalWebViewShow', { title: this.namesPerApi(i), url: (i.related_link || i.url)}),
          next_page: (i,p,cs,sS) => this.nextPageBook(i,p,cs,sS),
          search_api: (i,p,sS) => this.searchApiBook(i,p,sS),
        };
      default:
        return {
          add_five_api: this.props.navigation.goBack(),
          add_wish_api: this.props.navigation.goBack(),
          onclick_image: this.props.navigation.goBack(),
          next_page: this.props.navigation.goBack(),
          search_api: this.props.navigation.goBack()
        };
    }
  }

  namesPerApi(category, chunk) {
    switch (category) {
      case 'restaurant':
        return {
          title: chunk.place_name,
          subtitle: (chunk.subtitle || chunk.address_name),
          id: chunk.id,
          image: chunk.image_medium_url,
        };
      case 'music':
        return {
          title: chunk.track_name,
          subtitle: (chunk.subtitle || `${chunk.artist_name} / ${chunk.album_name}`),
          id: chunk.track_id,
          image: chunk.image_medium_url,
        };
      case 'book':
        return {
          title: chunk.title,
          subtitle: (chunk.subtitle || chunk.authors),
          id: chunk.isbn + chunk.authors + chunk.datetime,
          image: (chunk.image_medium_url || chunk.thumbnail)
        };
      default:
        return  {
          title: 'n/a',
          subtitle: 'n/a',
          id: 'n/a',
        }
    }
  }

  async fiveList(category, search_params, page, cb, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(`${Constant.CategoryToApi(category)}/list?s=${search_params}&page=${page}`, this.header)
      .then(cb).catch(eb);
  }

  async fiveUserList(category, id, page, cb, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(`${Constant.CategoryToApi(category)}/${id}/five_users?page=${page}`, this.header)
      .then(cb).catch(eb);
  }

  async fiveShow(category, id, cb, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.get(`${Constant.CategoryToApi(category)}/${id}`, this.header)
      .then(cb).catch(eb);
  }

  async wishCreate(category, id, cb, eb = (e) => this.defaultErrorHandler(e)) {
    const data = { favorable_id: id };
    await axios.post(`${ApiServer.MY_PROFILE}/create_wish?category=${category}`, data, this.header)
      .then(cb).catch(eb);
  }

  async wishDestroy(category, id, cb, eb = (e) => this.defaultErrorHandler(e)) {
    const data = { favorable_id: id };
    await axios.post(`${ApiServer.MY_PROFILE}/destroy_wish?category=${category}`, data, this.header)
      .then(cb).catch(eb);
  }

  async fiveCreate(category, id, cb, eb = (e) => this.defaultErrorHandler(e)) {
    const data = { favorable_id: id };
    await axios.post(`${ApiServer.MY_PROFILE}/create_five?category=${category}`, data, this.header)
      .then(async (res) => {
        await this.app.addFive(category, res.data.five);
        cb(res);
      }).catch(eb);
  }

  async fiveDestroy(category, id, cb, eb = (e) => this.defaultErrorHandler(e)) {
    const data = { favorable_id: id };
    this.id = id;
    await axios.post(`${ApiServer.MY_PROFILE}/destroy_five?category=${category}`, data, this.header)
      .then(async (res) => {
        await this.app.removeFive(category, this.id);
        cb(res);
      }).catch(eb);
  }

  // 카카오 맛집 검색결과 추가 하기 시작
  async addFiveRestaurant(document, index, title, cb, eb) {
    await axios.get(`${ApiServer.KAKAO_GEO_API}?x=${document.x}&y=${document.y}&input_coord=WGS84`, { headers: { 'Authorization': ApiServer.KAKAO_API_KEY, }, })
      .then((response) => {
        axios.post(`${ApiServer.MY_PROFILE}/add_or_create_five?category=restaurant`, { zipcode: response.data.documents[ 0 ].road_address.zone_no, chunk: document, }, this.header)
          .then(async(res) => {
            await this.app.addFive('restaurant', res.data.five).then(() => {
              cb(res)
            });
          }).catch(eb)
      }).catch((e) => this.defaultErrorHandler(e));
  }

  // 뮤직스 검색결과 추가 하기 시작
  async addFiveMusic(track, index, title, cb, eb) {
    await axios.post(`${ApiServer.MY_PROFILE}/add_or_create_five?category=music`, { chunk: track, }, this.header)
      .then(async(res) => {
        await this.app.addFive('music', res.data.five).then(() => {
          cb(res)
        });
      }).catch(eb);
  }

  // 카카오 책 검색결과 추가 하기 시작
  async addFiveBook(document, index, title, cb, eb) {
    await axios.post(`${ApiServer.MY_PROFILE}/add_or_create_five?category=book`, { chunk: document, }, this.header)
      .then(async(res) => {
        await this.app.addFive('book', res.data.five).then(() => {
          cb(res)
        });
      }).catch(eb);
  }

  // 카카오 맛집 검색결과 추가 하기 시작
  async addWishRestaurant(document, index, title) {
    await axios.get(`${ApiServer.KAKAO_GEO_API}?x=${document.x}&y=${document.y}&input_coord=WGS84`, { headers: { 'Authorization': ApiServer.KAKAO_API_KEY, }, })
      .then((response) => {
        axios.post(`${ApiServer.MY_PROFILE}/add_and_create_wish?category=restaurant`, { zipcode: response.data.documents[ 0 ].road_address.zone_no, chunk: document, }, this.header).then((response) => {
          this.toastHandler(`${title}이 보관함에 추가되었습니다.`)
        }).catch((e) => this.defaultErrorHandler(e));
      }).catch((e) => this.defaultErrorHandler(e));
  }

  // 뮤직스 검색결과 추가 하기 시작
  async addWishMusic(track, index, title) {
    await axios.post(`${ApiServer.MY_PROFILE}/add_and_create_wish?category=music`, { chunk: track, }, this.header).then((response) => {
      this.toastHandler(`${title}이 보관함에 추가되었습니다.`)
    }).catch((e) => this.defaultErrorHandler(e));
  }

  // 카카오 책 검색결과 추가 하기 시작
  async addWishBook(document, index, title) {
    await axios.post(`${ApiServer.MY_PROFILE}/add_and_create_wish?category=book`, { chunk: document, }, this.header).then((response) => {
      this.toastHandler(`${title}이 보관함에 추가되었습니다.`)
    }).catch((e) => this.defaultErrorHandler(e));
  }

  // 백엔드 단 카카오 검색 관련 시작
  async searchApiRestaurant(input_search, page, setState) {
    await axios.get(`${ApiServer.RESTAURANTS}/search_kakao?s=${input_search}&page=${page}`, this.header)
      .then((response) => {
        if (response.data.documents.length > 0) {
          setState({ no_result: false, searched: true, chunks: response.data.documents, no_more: response.data.meta.is_end });
        } else {
          setState({ no_result: true, searched: true, chunks: response.data.documents, no_more: response.data.meta.is_end });
        }
      }).catch((e) => this.defaultErrorHandler(e));
  }

  async nextPageRestaurant(input_search, page, chunks, setState) {
    await axios.get(`${ApiServer.RESTAURANTS}/search_kakao?s=${input_search}&page=${page}`, this.header)
      .then((response) => {
        setState({ chunks: [ ...chunks, ...response.data.documents ], no_more: response.data.meta.is_end });
      }).catch((e) => this.defaultErrorHandler(e));
  }

  // 백엔드 단 뮤직스 검색 관련 시작
  async searchApiMusic(input_search, page, setState) {
    await axios.get(`${ApiServer.MUSICS}/search_musix?s=${input_search}&page=${page}`, this.header)
      .then((response) => {
        if (response.data.tracks.length > 0) {
          setState({ no_result: false, searched: true, chunks: response.data.tracks, no_more: response.data.no_more });
        } else {
          setState({ no_result: true, searched: true, chunks: response.data.tracks, no_more: response.data.no_more });
        }
      }).catch((e) => this.defaultErrorHandler(e));
  }

  async nextPageMusic(input_search, page, chunks, setState) {
    await axios.get(`${ApiServer.MUSICS}/search_musix?s=${input_search}&page=${page}`, this.header)
      .then((response) => {
        setState({ chunks: [ ...chunks, ...response.data.tracks ], no_more: response.data.no_more });
      }).catch((e) => this.defaultErrorHandler(e));
  }

  // 책검색
  async searchApiBook(input_search, page, setState) {
    await axios.get(`${ApiServer.BOOKS}/search_kakao?s=${input_search}&page=${page}`, this.header)
      .then((response) => {
        if (response.data.documents.length > 0) {
          setState({ no_result: false, searched: true, chunks: response.data.documents });
        } else {
          setState({ no_result: true, searched: true, chunks: response.data.documents, no_more: response.data.meta.is_end });
        }
      }).catch((e) => this.defaultErrorHandler(e));
  }

  async nextPageBook(input_search, page, chunks, setState) {
    await axios.get(`${ApiServer.BOOKS}/search_kakao?s=${input_search}&page=${page}`, this.header)
      .then((response) => {
        setState({ chunks: [ ...chunks, ...response.data.documents ], no_more: response.data.meta.is_end });
      }).catch((e) => this.defaultErrorHandler(e));
  }


  async someFunction(cb, eb = (e) => this.defaultErrorHandler(e)) {
    await axios.post(`${ApiServer}`)
      .then(cb).catch(eb);
  }
}

export default FiveStore;