import {request, PERMISSIONS} from 'react-native-permissions';
import FastImage from 'react-native-fast-image'
import { RNCamera } from 'react-native-camera';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

styles = StyleSheet.create({
  camera: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
});

class App extends Component {
  
  state = { barcodes: [] }

  constructor(props) { 
    super(props);
    request(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA).then((result) => {
      if (result !== RESULTS.GRANTED) {
         exit(9);
      }
    })
  }
 
  renderBarcode = ({ bounds, data }) => (
    <React.Fragment key={data + bounds.origin.x}>
    <FastImage
        style={{
          position: 'absolute',
          justifyContent: 'center',
          ...bounds.size,
          left: bounds.origin.x,
          top: bounds.origin.y,
        }}
        source={{
             uri: data,
             priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.contain}
    />
    </React.Fragment>
  );

  renderBarcodes = () => (
    <View>
      {this.state.barcodes.map(this.renderBarcode)}
    </View>
  );
 
  barcodeDetected = ({ barcodes }) => {
 
    // Scale image compared to barcode and
    // re-calculate origins.
    barcodes.forEach(barcode => {
      Object.keys(barcode.bounds.size).map(function(key, val) {
        new_size = barcode.bounds.size[key] * 4;
        barcode.bounds.size[key] = new_size;
        if ( key === 'width' ) {
          barcode.bounds.origin.x -= new_size / 4;
        }
        else {
          barcode.bounds.origin.y -= new_size / 3;
        }
      });
    });

    this.setState({ barcodes })
  }; 

  render() {
    return (
     <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.camera}
          type={RNCamera.Constants.Type.back}
          captureAudio={false}
          onGoogleVisionBarcodesDetected={ this.barcodeDetected }
          googleVisionBarcodeType={RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.QR_CODE}>
          {this.renderBarcodes()}
        </RNCamera>
      </View>
    )
  }
}

export default App;
