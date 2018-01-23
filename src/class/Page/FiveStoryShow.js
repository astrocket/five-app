import React, { Component } from 'react';
import {
  View, WebView, ScrollView, Dimensions,
} from 'react-native';
import {
  Container,
  Header,
  Content, Toast,
  Text, Button, Icon,
  Spinner, ActionSheet,
} from 'native-base';
import {
  Col,
  Row,
  Grid,
} from 'react-native-easy-grid';
import axios from 'axios';
import * as Constant from '../../config/Constant';
import * as ApiServer from '../../config/ApiServer';
import { FiveUnitBar } from '../../component/common';
import BaseStyle from '../../config/BaseStyle';
import { observer, inject } from 'mobx-react/native';

@inject('ApplicationStore') // Inject some or all the stores!
@observer
export default class FiveStoryShow extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.title,
    headerRight: (
      navigation.state.params.navLoading ?
        null :
        <View style={BaseStyle.headerDoubleIconsContainer}>
          <Button onPress={navigation.state.params.openShareActionSheet} transparent>
            <Icon
              name="ios-share-outline"
              style={{
                fontSize: 25,
                color: Constant.FiveColor,
              }}
            />
          </Button>
        </View>
    ),
    ...Constant.FiveNavOptions,
  });

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      five_story: this.props.navigation.state.params.five_story,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      openShareActionSheet: () => this.openShareActionSheet(),
    });
  }

  openShareActionSheet() {
    const BUTTONS = [ '카카오톡 공유하기', 'Cancel' ];
    const CANCEL_INDEX = 1;

    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
      },
      buttonIndex => this.shareAction(BUTTONS[ buttonIndex ]),
    );
  }

  shareAction(value) {
    Toast.show({
      text: value,
      position: 'bottom',
      duration: 1500,
    });
  }

  render() {
    const { container, preLoading } = BaseStyle;
    const { navigation } = this.props;
    const deviceWidth = Dimensions.get('window').width;

    return (
      <Container>
        <Grid>
          <Row>
            <WebView
              source={{ uri: `${ApiServer.FIVE_STORY}/${navigation.state.params.id}` }}
              style={{ flex: 1 }}
            />
          </Row>
          <Row style={{ height: 90, backgroundColor: '#fff'}}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={10}
              pagingEnabled
            >
              {this.state.five_story.fives.map((item) => {
                return (
                  <View key={item.id} style={{ width: deviceWidth, padding: 5 }}>
                    <FiveUnitBar
                      id={item.id}
                      title={item.title}
                      location={item.subtitle}
                      image_url={item.image_url}
                      onPress={() => navigation.navigate(`${item.klass}Show`, {
                        title: item.title,
                        id: item.id,
                        navLoading: true,
                      })}
                    />
                  </View>
                )
              })}
            </ScrollView>
          </Row>
        </Grid>
        {this.state.loading &&
        <View style={preLoading}>
          <Spinner size="large" />
        </View>
        }
      </Container>
    );
  }
}
