{/*
            <List style={{ paddingBottom: 20 }}>
              <ListItem avatar style={{ borderTopWidth: 0.5, borderTopColor: 'rgba(237, 237, 237, 0.5)', borderBottomWidth: 0.5, borderBottomColor: 'rgba(237, 237, 237, 0.5)', padding: 5, marginBottom: 10}}>
                <Left>
                  <Thumbnail small source={Images.findImageOf(this.state.category)}/>
                </Left>
                <Body style={{ borderBottomWidth: 0 }}>
                <Text>{this.state.category_korean}</Text>
                </Body>
              </ListItem>
              {/* 지도 */}
              <ListItemIconClick
                icon={'md-map'}
                onPress={() => this.props.screenProps.modalNavigation.navigate('Map', {
                  lat: this.state.five.lat,
                  lng: this.state.five.lng,
                  title: this.state.five.title,
                })}
                target={this.state.five.address}
                title={this.state.five.address}
              />
              {/* 전화 */}
              <ListItemIconClick
                icon={'md-call'}
                onPress={() => Linking.openURL(`tel:${this.state.five.phone}`)}
                target={this.state.five.phone}
                title={this.state.five.phone}
              />
              {/* 링크 */}
              <ListItemIconClick
                label={'가사'}
                onPress={() => this.props.screenProps.modalNavigation.navigate('ModalWebViewShow', {
                  url: this.state.five.related_link,
                  headerTitle: '가사 보기'
                })}
                target={this.state.five.related_link}
                title={'가사 보기'}
              />
              {/* 유튜브 링크 */}
              <ListItemIconClick
                label={'YouTube'}
                onPress={() => this.props.screenProps.modalNavigation.navigate('ModalWebViewShow', {
                  url: this.state.five.youtube_link,
                  headerTitle: this.state.five.track_name
                })}
                target={this.state.five.youtube_link}
                title={'음악 듣기'}
              />
            </List>
*/}