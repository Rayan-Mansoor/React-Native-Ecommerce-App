import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import store , {setNetworkState } from './store';
import _ from 'lodash';

const handleConnectivityChange = _.debounce((state: NetInfoState) => {
  store.dispatch(setNetworkState(state.isInternetReachable));
}, 300);

NetInfo.addEventListener(handleConnectivityChange);

export default {};
