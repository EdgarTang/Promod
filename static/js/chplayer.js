/*
	������ƣ�chplayer
	����汾��V1.0
	������ߣ�http://www.chplayer.com
	��Դ���Э�飺Mozilla Public License, version 2.0(MPL 2.0)
	MPL 2.0Э��Ӣ�ģ�ԭ�ģ��������鿴��ַ��https://www.mozilla.org/en-US/MPL/2.0/
	MPL 2.0Э�����ģ����룩�鿴��ַ��http://www.chplayer.com/res/Mozilla_Public_License_2.0_Simplified_Chinese_Reference.txt
	---------------------------------------------------------------------------------------------
	����˵����
	ʹ�õ���Ҫ�������ԣ�javascript(js)��actionscript3.0(as3.0)(as3.0��Ҫ����flashplayer���ֵĿ��������ڸ�ҳ�����)
	���ܣ�������Ƶ
	�ص㣺����HTML5-VIDEO(����)�Լ�FlashPlayer
	=====================================================================================================================
*/
!(function() {
	var javascriptPath = '';
	! function() {
		var scriptList = document.scripts,
			thisPath = scriptList[scriptList.length - 1].src;
		javascriptPath = thisPath.substring(0, thisPath.lastIndexOf('/') + 1);
	}();
	var chplayer = function(obj) {
		if(obj) {
			this.embed(obj);
		}
	};
	chplayer.prototype = {
		/*
			javascript���ֿ������õ�ע��˵����
			1����ʼ��-�������ʱ�����еĴ��벿��
			2��������ʽ-����������div,p,canvas�ȣ�����ʽ����css
			3����������-����Ԫ�ؽڵ㣨����-click��������-mouseover������뿪-mouseout������ƶ�-mousemove�ȣ��¼�
			4�������¼�-������Ƶ��״̬�����ţ���ͣ��ȫ�����������ڵȣ��¼�
			5�����ú���-���ຯ�����ⲿҲ����ʹ��
			6��ȫ�ֱ���-�����ȫ��ʹ�õı���
			7���������ע��
			ȫ�ֱ���˵����
			�ڱ��������ʹ�õ���ȫ�ֱ��������������ͣ�����Boolean��String��Int��Object������Ԫ�ض���ͱ������󣩣�Array��Function�ȣ�
			�����г���Ҫ��ȫ�ֱ�����
				V:Object����Ƶ����
				VA:Array����Ƶ�б�������Ƶ��ַ�����ͣ�������˵����
				ID:String����ƵID
				CB:Object����������Ԫ�صļ��϶���
				PD:Object���ڲ���Ƶ��������
			---------------------------------------------------------------------------------------------
			����ʼ
			����Ϊ��Ҫ��ʼ�����õ�ȫ�ֱ���
			��ʼ������
			config��ȫ�ֱ���/�������ͣ�Object/���ܣ�����һЩ��������
		*/
		config: {
			videoClick: true, //�Ƿ�֧�ֵ�������/��ͣ����
			videoDbClick: true, //�Ƿ�֧��˫��ȫ��/�˳�ȫ������
			errorTime: 100, //�ӳ��ж�ʧ�ܵ�ʱ�䣬��λ������
			videoDrawImage: false //�Ƿ�ʹ����ƵdrawImage���ܣ�ע�⣬�ù������ƶ��˱��ֲ���
		},
		//ȫ�ֱ���/�������ͣ�Object/���ܣ�������Ĭ�����ã����ⲿ���ݹ�����Ӧ���ú����������滻
		varsConfig: {
			container: '', //��Ƶ������ID
			variable: 'chplayer', //���ź���(����)����
			volume: 0.8, //Ĭ����������Χ0-1
			poster: '', //����ͼƬ��ַ
			autoplay: true, //�Ƿ��Զ�����
			loop: false, //�Ƿ���Ҫѭ������
			live: false, //�Ƿ���ֱ��
			seek: 0, //Ĭ����Ҫ��ת������
			drag: '', //�϶�ʱ֧�ֵ�ǰ�ò���
			front: '', //ǰһ����ť����
			next: '', //��һ����ť����
			loaded: '', //���ز���������õĺ���
			flashplayer: false, //���ó�true��ǿ��ʹ��flashplayer
			html5m3u8: false, //PCƽ̨���Ƿ�ʹ��h5����������m3u8
			track: null, //��Ļ���
			chtrack: null, //ch��Ļ
			preview: null, //Ԥ��ͼƬ����
			prompt: null, //��ʾ�㹦��
			video: null, //��Ƶ��ַ
			debug:false//�Ƿ�������ģʽ
		},
		vars: {},
		//ȫ�ֱ���/�������ͣ�Object/���ܣ���������
		language: {
			volume: '������',
			play: '�������',
			pause: '�����ͣ',
			full: '���ȫ��',
			escFull: '�˳�ȫ��',
			mute: '�������',
			escMute: 'ȡ������',
			front: '��һ��',
			next: '��һ��',
			definition: '���ѡ��������',
			error: '���س���'
		},
		//ȫ�ֱ���/�������ͣ�Array/���ܣ��Ҽ��˵���[�˵�����,����(link:���ӣ�default:��ɫ��function�����ú�����javascript:����js����),ִ������(�������ӵ�ַ����������),[line(�����)]]
		contextMenu: [
			['chplayer', 'link', 'http://www.chplayer.com'],
			['v1.0', 'default'],
			['������Ƶ', 'function', 'play', 'line'],
			['��ͣ��Ƶ', 'function', 'pause'],
			['����/��ͣ', 'function', 'playOrPause']
		],
		//ȫ�ֱ���/�������ͣ�Array/���ܣ������б�
		errorList: [
			['000', 'Object does not exist'],
			['001', 'Variables type is not a object'],
			['002', 'Video object does not exist'],
			['003', 'Video object format error'],
			['004', 'Video object format error'],
			['005', 'Video object format error'],
			['006', '[error] does not exist '],
			['007', 'Ajax error'],
			['008', 'Ajax error'],
			['009', 'Ajax object format error'],
			['010', 'Ajax.status:[error]']
		],
		//ȫ�ֱ���/�������ͣ�String/���ܣ�����logo
		logo: '',
		//ȫ�ֱ���/�������ͣ�Boolean/���ܣ��Ƿ�����˲�����
		loaded: false,
		//ȫ�ֱ���/�������ͣ���ʱ��/���ܣ�������Ƶ���س����״̬
		timerError: null,
		//ȫ�ֱ���/�������ͣ�Boolean/���ܣ��Ƿ����
		error: false,
		//ȫ�ֱ���/�������ͣ�Array/���ܣ������ַ������
		errorUrl: [],
		//ȫ�ֱ���/�������ͣ�Array/���ܣ������洢��������ĺ����б���Ƶ���ش���ʱ��������ĺ���������յ���Ϣ
		errorFunArr: [],
		//ȫ�ֱ���/�������ͣ���ʱ��/���ܣ�����ȫ�����ȫ��״̬
		timerFull: null,
		//ȫ�ֱ���/�������ͣ�Boolean/���ܣ��Ƿ�ȫ��״̬
		full: false,
		//ȫ�ֱ���/�������ͣ�Array/���ܣ������洢ȫ�����ȫ�������ĺ����б�����ȫ�����ȫ��ʱ��������ĺ���������յ���Ϣ
		fullFunArr: [],
		//ȫ�ֱ���/�������ͣ�Array/���ܣ������洢���ŵ�ַ�ı�ļ��������ĺ����б������ŵ�ַ�����ı�ʱ��������ĺ���������յ���Ϣ
		videoChangeFunArr: [],
		//ȫ�ֱ���/�������ͣ���ʱ��/���ܣ�������ǰ����/�� ʱ:��:��
		timerTime: null,
		//ȫ�ֱ���/�������ͣ���ʱ��/���ܣ�������Ƶ����
		timerBuffer: null,
		//ȫ�ֱ���/�������ͣ�Boolean/���ܣ����ý��Ȱ�ť���������Ƿ����ʱ��仯����������Ҫ�����ڰ��½��Ȱ�ťʱ��ͣ���Ȱ�ť�ƶ��ͽ������ĳ��ȱ仯
		isTimeButtonMove: true,
		//ȫ�ֱ���/�������ͣ�Boolean/���ܣ��������Ƿ���Ч�������ֱ��������Ҫ����ʱ���ý��Ȱ�ť�ͽ������仯
		isTimeButtonDown: false,
		//ȫ�ֱ���/�������ͣ�Boolean/���ܣ�����ģ��˫�����ܵ��ж�
		isClick: false,
		//ȫ�ֱ���/�������ͣ���ʱ��/���ܣ�����ģ��˫�����ܵļ�ʱ��
		timerClick: null,
		//ȫ�ֱ���/�������ͣ���ʱ��/���ܣ���תloading
		timerLoading: null,
		//ȫ�ֱ���/�������ͣ���ʱ��/���ܣ������������Ƶ���ƶ���ʾ������
		timerCBar: 0,
		//ȫ�ֱ���/�������ͣ�Int/���ܣ�������Ƶʱ����ñ�����ֵ����0���������ת�����ø�ֵΪ0
		needSeek: 0,
		//ȫ�ֱ���/�������ͣ�Int/���ܣ���ǰ����
		volume: 0,
		//ȫ�ֱ���/�������ͣ�Number/���ܣ���ǰ����ʱ��
		time: 0,
		//ȫ�ֱ���/�������ͣ�Boolean/���ܣ������״ε���
		isFirst: true,
		//ȫ�ֱ���/�������ͣ�Boolean/���ܣ��Ƿ�ʹ��HTML5-VIDEO����
		html5Video: true,
		//ȫ�ֱ���/�������ͣ�Object/���ܣ���¼��Ƶ�����ڵ��x,y
		pdCoor: { x: 0, y: 0 },
		//ȫ�ֱ���/�������ͣ�String/���ܣ��жϵ�ǰʹ�õĲ��������ͣ�html5video��flashplayer
		playerType: '',
		//ȫ�ֱ���/�������ͣ�Int/���ܣ����ؽ������ĳ���
		loadTime: 0,
		//ȫ�ֱ���/body����
		body: document.body || document.documentElement,
		//ȫ�ֱ���/V/������
		V: null,
		//ȫ�ֱ���/��������¼����飬ͳһ����
		listenerArr: [],
		//ȫ�ֱ���/�����������ʾԪ�ص��ܿ��
		buttonLen: 0,
		//ȫ�ֱ���/�����������ʾԪ�ص�����
		buttonArr: [],
		//ȫ�ֱ���/���水ťԪ�صĿ�
		buttonWidth: {},
		//ȫ�ֱ���/���沥����������Ԫ��������
		elementArr: [],
		//ȫ�ֱ���/��Ļ����
		track: [],
		//ȫ�ֱ���/��Ļ����
		trackIndex: 0,
		//ȫ�ֱ���/��ǰ��ʾ����Ļ����
		nowTrackShow: { sn: '' },
		//ȫ�ֱ���/������ĻԪ������
		trackElement: [],
		//ȫ�ֱ���/����Ƶת��ΪͼƬ
		timerVCanvas: null,
		//ȫ�ֱ���/animate
		animateArray: [],
		//ȫ�ֱ���/����animate��Ԫ��
		animateElementArray: [],
		//ȫ�ֱ���/������Ҫ����ͣʱֹͣ����������
		animatePauseArray: [],
		//ȫ�ֱ���/Ԥ��ͼƬ����״̬/0=û�м��أ�1=���ڼ��أ�2=�������
		previewStart: 0,
		//ȫ�ֱ���/Ԥ��ͼƬ����
		previewDiv: null,
		//ȫ�ֱ���/Ԥ����
		previewTop: null,
		//ȫ�ֱ���/Ԥ����Ŀ�
		previewWidth: 120,
		//ȫ�ֱ���/Ԥ��ͼƬ������������
		previewTween: null,
		//ȫ�ֱ���/�Ƿ���m3u8��ʽ���ǵĻ�����Լ���hls.js
		isM3u8: false,
		//ȫ�ֱ���/������ʾ������
		promptArr: [],
		//ȫ�ֱ���/��ʾ��ʾ���ļ�������
		promptElement: null,
		/*
			��Ҫ�������ֿ�ʼ
			���ӿں�����
			���ò��������ʼ���ú���
		*/
		embed: function(c) {
			//c:Object���ǵ��ýӿڴ��ݵ����Զ���
			if(c == undefined || !c) {
				this.eject(this.errorList[0]);
				return;
			}
			if(typeof(c) != 'object') {
				this.eject(this.errorList[1]);
			}
			this.vars = this.standardization(this.varsConfig, c);
			if((!this.supportVideo() && this.vars['flashplayer'] != '') || this.vars['flashplayer']) {
				this.html5Video = false;
			}
			if(this.vars['video']) {
				//�ж���Ƶ��������
				this.analysedVideoUrl(this.vars['video']);
				return this;
			} else {
				this.eject(this.errorList[2]);
			}
		},
		/*
			�ڲ�����
			�����ⲿ���ݹ�����video��ʼ������Ƶ��ַ
		*/
		analysedVideoUrl: function(video) {
			var i = 0,
				y = 0;
			var thisTemp = this;
			//����ȫ�ֱ���VA:Array����Ƶ�б�������Ƶ��ַ�����ͣ�������˵����
			this.VA = [];
			if(typeof(video) == 'string') { //������ַ���ʽ�����жϺ�׺�������
				this.VA = [
					[video, '', '', 0]
				];
				var fileExt = this.getFileExt(video);
				switch(fileExt) {
					case '.mp4':
						this.VA[0][1] = 'video/mp4';
						break;
					case '.ogg':
						this.VA[0][1] = 'video/ogg';
						break;
					case '.webm':
						this.VA[0][1] = 'video/webm';
						break;
					default:
						break;
				}
				this.getVideo();
			} else if(typeof(video) == 'object') { //���������
				if(!this.isUndefined(typeof(video.length))) { //˵��������
					if(typeof(video[0]) == 'string') {
						/*
						 ������ı���ʽ������
						video:['url','type','url','type']
						*/
						if(video.length % 2 == 1) {
							this.eject(this.errorList[3]);
							return;
						}
						for(i = 0; i < video.length; i++) {
							if(i % 2 == 0) {
								this.VA.push([video[i], video[i + 1], '', 0]);
							}
						}
					} else if(!this.isUndefined(typeof(video[0].length))) { //˵����������ʽ������
						this.VA = video;
					} else {
						/*
						 	�����ʽ��˵���Ǳ�׼����Ƶ��ַ��ʽ
							video: [
								{
									definition: '',
									list: [
										{
											url: '',
											type: '',
											weight:0
										},
										{
											url: '',
											type: '',
											weight:10
										}
									]
								},
								{
									definition: '',
									list: [
										{
											url: '',
											type: '',
											weight:0
										}

									]
								}
							]
						*/
						//������Ƶ��ַ

						for(i = 0; i < video.length; i++) {
							var vlist = video[i]['list'];
							for(y = 0; y < vlist.length; y++) {
								this.VA.push([vlist[y]['url'], vlist[y]['type'], video[i]['definition'], this.isUndefined(vlist[y]['weight']) ? 0 : vlist[y]['weight']]);
							}
						}
					}
					this.getVideo();
				} else {
					/*
						���video��ʽ�Ƕ�����ʽ����ֶ���
						���video���������type����ֱ�Ӳ���
					*/
					if(!this.isUndefined(video['type'])) {
						this.VA.push([video['url'], video['type'], '', 0]);
						this.getVideo();
					}
					/*
						���video���������ajax����ʹ��ajax����
					*/
					else if(!this.isUndefined(video['url'])) { //ֻҪ����url������Ϊ��ajax����
						video.success = function(data) {
							thisTemp.analysedVideoUrl(data);
						};
						this.ajax(video);
					} else {
						this.eject(this.errorList[5]);
					}
				}
			} else {
				this.eject(this.errorList[4]);
			}
		},
		/*
			�ڲ�����
			��������֧�ֵ���Ƶ��ʽ���������֧�ֵ���Ƶ��ʽ���·���������б�
		*/
		getHtml5Video: function() {
			var va = this.VA;
			var nva = [];
			var mobile = false;
			var video = document.createElement('video');
			var codecs = function(type) {
				var cod = '';
				switch(type) {
					case 'video/mp4':
						cod = 'avc1.4D401E, mp4a.40.2';
						break;
					case 'video/ogg':
						cod = 'theora, vorbis';
						break;
					case 'video/webm':
						cod = 'vp8.0, vorbis';
						break;
					default:
						break;
				}
				return cod;
			};
			var supportType = function(vidType, codType) {
					if(!video.canPlayType) {
						this.html5Video = false;
						return;
					}
				var isSupp = video.canPlayType(vidType + ';codecs="' + codType + '"');
				if(isSupp == '') {
					return false
				}
				return true;

			};
			if(this.vars['flashplayer']) {
				this.html5Video = false;
				return;
			}
			if(navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i)) {
				mobile = true;
			}
			for(var i = 0; i < va.length; i++) {
				var v = va[i];
				if(v){
					if(v[1] != '' && !mobile && supportType(v[1], codecs(v[1])) && v[0].substr(0, 4) != 'rtmp') {
						nva.push(v);
					}
					if(this.getFileExt(v[0]) == '.m3u8' && this.vars['html5m3u8']) {
						this.isM3u8 = true;
						nva.push(v);
					}
				}
			}
			if(nva.length > 0) {
				this.VA = nva;
			} else {
				if(!mobile) {
					this.html5Video = false;
				}
			}
		},
		/*
			�ڲ�����
			������Ƶ��ַ��ʼ����������
		*/
		getVideo: function() {
			//���������Ļ�����
			if(this.V) { //����������Ѵ��ڣ�����Ϊ�Ǵ�newVideo�������͹���������
				this.changeVideo();
				return;
			}
			if(this.vars['chtrack']) {
				this.loadTrack();
			}
			this.getHtml5Video(); //�ж������֧�ֵ���Ƶ��ʽ
			var thisTemp = this;
			var v = this.vars;
			var src = '',
				source = '',
				poster = '',
				loop = '',
				autoplay = '',
				track = '';
			var video = v['video'];
			var i = 0;

			this.CD = this.getByElement(v['container']);
			volume = v['volume'];
			if(!this.CD) {
				this.eject(this.errorList[6], v['container']);
				return false;
			}
			//��ʼ������������
			var playerID = 'chplayer' + this.randomString();
			var playerDiv = document.createElement('div');

			playerDiv.className = playerID;
			this.V = undefined;
			this.CD.innerHTML = '';

			this.CD.appendChild(playerDiv);
			this.PD = this.getByElement(playerID); //PD:���岥������������ȫ�ֱ���
			this.css(this.CD, {
				backgroundColor: '#000000',
				overflow: 'hidden',
				position: 'relative'
			});
			this.css(this.PD, {
				backgroundColor: '#000000',
				width: '100%',
				height: '100%',
				fontFamily: '"Microsoft YaHei", YaHei, "΢���ź�", SimHei,"\5FAE\8F6F\96C5\9ED1", "����",Arial'
			});
			if(this.html5Video) { //���֧��HTML5-VIDEO��Ĭ��ʹ��HTML5-VIDEO������
				//��ֹ���������������ѡ���ı�
				this.PD.onselectstart = this.PD.ondrag = function() {
					return false;
				};
				//��������������ɲ������ú���ʽ
				//����������
				if(this.VA.length == 1) {
					src = ' src="' + this.VA[0][0] + '"';
				} else {
					var videoArr = this.VA.slice(0);
					videoArr = this.arrSort(videoArr);
					for(i = 0; i < videoArr.length; i++) {
						var type = '';
						var va = videoArr[i];
						if(va[1]) {
							type = ' type="' + va[1] + '"';
						}
						source += '<source src="' + va[0] + '"' + type + '>';
					}
				}
				//������Ƶ��ַ����
				if(v['autoplay']) {
					autoplay = ' autoplay="autoplay"';
				}
				if(v['poster']) {
					poster = ' poster="' + v['poster'] + '"';
				}
				if(v['loop']) {
					loop = ' loop="loop"';
				}
				if(v['seek'] > 0) {
					this.needSeek = v['seek'];
				}
				if(v['track'] != null && v['chtrack'] == null) {
					var trackArr = v['track'];
					var trackDefault = '';
					var defaultHave = false;
					for(i = 0; i < trackArr.length; i++) {
						var trackObj = trackArr[i];
						if(trackObj['default'] && !defaultHave) {
							trackDefault = ' default';
							defaultHave = true;
						} else {
							trackDefault = '';
						}
						track += '<track kind="' + trackObj['kind'] + '" src="' + trackObj['src'] + '" srclang="' + trackObj['srclang'] + '" label="' + trackObj['label'] + '"' + trackDefault + '>';
					}
				}
				var vid = this.randomString();
				var html = '';
				if(!this.isM3u8) {
					html = '<video id="' + vid + '"' + src + ' width="100%" height="100%"' + autoplay + poster + loop + ' webkit-playsinline="true">' + source + track + '</video>';
				} else {
					html = '<video id="' + vid + '" width="100%" height="100%"' + poster + loop + ' webkit-playsinline="true">' + track + '</video>';
				}
				this.PD.innerHTML = html;
				this.V = this.getByElement('#'+vid); //V�����岥��������ȫ�ֱ���
				this.V.volume = volume; //��������
				if(this.isM3u8) {
					var loadJsHandler = function() {
						thisTemp.embedHls(thisTemp.VA[0][0], v['autoplay']);
					};
					this.loadJs(javascriptPath + 'hls/hls.min.js', loadJsHandler);
				}
				this.css(this.V, 'backgroundColor', '#000000');
				//����һ����������
				if(this.config['videoDrawImage']) {
					var canvasID = 'vcanvas' + this.randomString();
					var canvasDiv = document.createElement('div');
					canvasDiv.className = canvasID;
					this.PD.appendChild(canvasDiv);
					this.MD = this.getByElement(canvasID); //���廭���洢����
					this.css(this.MD, {
						backgroundColor: '#000000',
						width: '100%',
						height: '100%',
						position: 'absolute',
						display: 'none',
						cursor: 'pointer',
						left: '0px',
						top: '0px',
						zIndex: '10'
					});
					var cvid = 'ccanvas' + this.randomString();
					this.MD.innerHTML = this.newCanvas(cvid, this.PD.offsetWidth, this.PD.offsetHeight);
					this.MDC = this.getByElement(cvid + '-canvas');
					this.MDCX = this.MDC.getContext('2d');
				}
				this.playerType = 'html5video';
				//������������ɲ������ú���ʽ
				//�����������ļ������������������������¼�����
				this.addVEvent();
				//���������ȵ�ֵ�����������л���ť
				this.definition();
				this.playerLoad();
			} else { //�����֧��HTML5-VIDEO�����flashplayer
				this.embedSWF();
			}
		},
		/*
			�ڲ�����
			���Ͳ��������سɹ�����Ϣ
		*/
		playerLoad: function() {
			var thisTemp = this;
			if(this.isFirst) {
				this.isFirst = false;
				window.setTimeout(function() {
					thisTemp.loadedHandler();
				}, 1);
			}
		},
		/*
			�ڲ�����
			�����������ļ������������������������¼�����
		*/
		addVEvent: function() {
			var thisTemp = this;
			//������Ƶ�����¼�
			var eventVideoClick = function(event) {
				thisTemp.videoClick();
			};
			this.addListener('click', eventVideoClick);
			this.addListener('click', eventVideoClick, this.MDC);
			//�ӳټ������ʧ���¼�
			this.timerErrorFun();
			//������Ƶ���ص�Ԫ�����¼�
			var eventJudgeIsLive = function(event) {
				thisTemp.judgeIsLive();
			};
			this.addListener('loadedmetadata', eventJudgeIsLive);
			//������Ƶ�����¼�
			var eventPlaying = function(event) {
				thisTemp.playingHandler();
			};
			this.addListener('playing', eventPlaying);
			//������Ƶ��ͣ�¼�
			var eventPause = function(event) {
				thisTemp.pauseHandler();
			};
			this.addListener('pause', eventPause);
			//������Ƶ����ʱ���¼�
			var eventTimeupdate = function(event) {
				if(thisTemp.timerLoading != null) {
					thisTemp.loadingStart(false);
				}
			};
			this.addListener('timeupdate', eventTimeupdate);
			//������Ƶ�����¼�
			var eventWaiting = function(event) {
				thisTemp.loadingStart(true);
			};
			this.addListener('waiting', eventWaiting);
			//������Ƶseek�����¼�
			var eventSeeked = function(event) {
				thisTemp.seekedHandler();
			};
			this.addListener('seeked', eventSeeked);
			//������Ƶ���Ž����¼�
			var eventEnded = function(event) {
				thisTemp.endedHandler();
			};
			this.addListener('ended', eventEnded);
			//������Ƶ����
			var eventVolumeChange = function(event) {
				try {
					thisTemp.volumechangeHandler();
				} catch(event) {}
			};
			this.addListener('volumechange', eventVolumeChange);
			//��������
			this.interFace();
		},
		/*
			�ڲ�����
			���ý���Ԫ��
		*/
		resetPlayer: function() {
			this.timeTextHandler();
			this.timeProgress(0, 1); //�ı�ʱ���������
			this.initPlayPause(); //�ж���ʾ���Ż���ͣ��ť
			this.definition(); //���������Ȱ�ť
			this.showFrontNext(); //������һ����һ����ť
			this.deletePrompt(); //ɾ����ʾ��
			this.deletePreview(); //ɾ��Ԥ��ͼ
			this.trackHide(); //������Ļ
			this.resetTrack();
			this.trackElement = [];
			this.track = [];
		},
		/*
			�ڲ�����
			��������Ԫ��
		 */
		interFace: function() {
			var thisTemp = this;
			var html = ''; //����������
			var i = 0;
			var bWidth = 38, //��ť�Ŀ�
				bHeight = 38; //��ť�ĸ�
			var bBgColor = '#FFFFFF', //��ťԪ��Ĭ����ɫ
				bOverColor = '#0782F5'; //��ťԪ����꾭��ʱ����ɫ
			var timeInto = '00:00 / 00:00'; //ʱ����ʾ��Ĭ����ʾ����
			var randomS = this.randomString(10); //��ȡһ������ַ���
			/*
				���¶�������Ԫ�ص�ID��ͳһ��ID����
			*/

			var controlBarBgID = 'controlbgbar' + randomS, //����������
				controlBarID = 'controlbar' + randomS, //����������
				timeProgressBgID = 'timeprogressbg' + randomS, //���Ž���������
				loadProgressID = 'loadprogress' + randomS, //���ؽ�����
				timeProgressID = 'timeprogress' + randomS, //���Ž�����
				timeBOBGID = 'timebobg' + randomS, //���Ž��Ȱ�ť��������Ԫ��Ϊһ��͸�������ڲ��Ž�������
				timeBOID = 'timebo' + randomS, //���Ž��ȿ��϶���ť���
				timeBWID = 'timebw' + randomS, //���Ž��ȿ��϶���ť�ڿ�
				timeTextID = 'timetext' + randomS, //ʱ���ı���
				playID = 'play' + randomS, //���Ű�ť
				pauseID = 'pause' + randomS, //��ͣ��ť
				frontID = 'front' + randomS, //ǰһ����ť
				nextID = 'next' + randomS, //��һ����ť
				fullID = 'full' + randomS, //ȫ����ť
				escFullID = 'escfull' + randomS, //�˳�ȫ����ť
				muteID = 'mute' + randomS, //������ť
				escMuteID = 'escmute' + randomS, //ȡ��������ť
				volumeID = 'volume' + randomS, //�������ڿ�����
				volumeDbgID = 'volumedbg' + randomS, //�������ڿ���������
				volumeBgID = 'volumebg' + randomS, //�������ڿ򱳾���
				volumeUpID = 'volumeup' + randomS, //�������ڿ�ɱ��Ȳ�
				volumeBOID = 'volumebo' + randomS, //�������ڰ�ť���
				volumeBWID = 'volumebw' + randomS, //�������ڰ�ť�ڿ�
				definitionID = 'definition' + randomS, //����������
				definitionPID = 'definitionp' + randomS, //�������б�����
				promptBgID = 'promptbg' + randomS, //��ʾ�򱳾�
				promptID = 'prompt' + randomS, //��ʾ��
				dlineID = 'dline' + randomS, //�ָ��߹���ǰ׺
				menuID = 'menu' + randomS, //�Ҽ�����
				pauseCenterID = 'pausecenter' + randomS, //�м���ͣ��ť
				loadingID = 'loading' + randomS, //����
				errorTextID = 'errortext' + randomS, //�����ı���
				logoID = 'logo' + randomS; //logo
			//����һЩPD����������������ʹ�õ�Ԫ��
			var controlBarBg = document.createElement('div'),
				controlBar = document.createElement('div'),
				timeProgressBg = document.createElement('div'),
				timeBoBg = document.createElement('div'),
				pauseCenter = document.createElement('div'),
				errorText = document.createElement('div'),
				promptBg = document.createElement('div'),
				prompt = document.createElement('div'),
				menuDiv = document.createElement('div'),
				definitionP = document.createElement('div'),
				loading = document.createElement('div'),
				logo = document.createElement('div');

			controlBarBg.className = controlBarBgID;
			controlBar.className = controlBarID;
			timeProgressBg.className = timeProgressBgID;
			timeBoBg.className = timeBOBGID;
			promptBg.className = promptBgID;
			prompt.className = promptID;
			menuDiv.className = menuID;
			definitionP.className = definitionPID;
			pauseCenter.className = pauseCenterID;
			loading.className = loadingID;
			logo.className = logoID;
			errorText.className = errorTextID;

			this.PD.appendChild(controlBarBg);
			this.PD.appendChild(controlBar);
			this.PD.appendChild(timeProgressBg);
			this.PD.appendChild(timeBoBg);
			this.PD.appendChild(promptBg);
			this.PD.appendChild(prompt);
			this.PD.appendChild(definitionP);
			this.PD.appendChild(pauseCenter);

			this.PD.appendChild(loading);
			this.PD.appendChild(errorText);
			this.PD.appendChild(logo);
			this.body.appendChild(menuDiv);
			//����һЩPD����������������ʹ�õ�Ԫ�ؽ���

			if(this.vars['live']) { //�����ֱ����ʱ����ʾ�ı�������ʾ��ǰϵͳʱ��
				timeInto = this.getNowDate();
			}
			//����������������
			html += '<div class="' + playID + '" data-title="' + thisTemp.language['play'] + '">' + this.newCanvas(playID, bWidth, bHeight) + '</div>'; //���Ű�ť
			html += '<div class="' + pauseID + '" data-title="' + thisTemp.language['pause'] + '">' + this.newCanvas(pauseID, bWidth, bHeight) + '</div>'; //��ͣ��ť
			html += '<div class="' + dlineID + '-la"></div>'; //�ָ���
			html += '<div class="' + frontID + '" data-title="' + thisTemp.language['front'] + '">' + this.newCanvas(frontID, bWidth, bHeight) + '</div>'; //ǰһ����ť
			html += '<div class="' + dlineID + '-lb"></div>'; //�ָ���
			html += '<div class="' + nextID + '" data-title="' + thisTemp.language['next'] + '">' + this.newCanvas(nextID, bWidth, bHeight) + '</div>'; //��һ����ť
			html += '<div class="' + dlineID + '-lc"></div>'; //�ָ���

			html += '<div class="' + timeTextID + '">' + timeInto + '</div>'; //ʱ���ı�
			html += '<div class="' + fullID + '" data-title="' + thisTemp.language['full'] + '">' + this.newCanvas(fullID, bWidth, bHeight) + '</div>'; //ȫ����ť
			html += '<div class="' + escFullID + '" data-title="' + thisTemp.language['escFull'] + '">' + this.newCanvas(escFullID, bWidth, bHeight) + '</div>'; //�˳�ȫ����ť
			html += '<div class="' + dlineID + '-ra"></div>'; //�ָ���
			html += '<div class="' + definitionID + '" data-title="' + thisTemp.language['definition'] + '"></div>'; //����������
			html += '<div class="' + dlineID + '-rb"></div>'; //�ָ���
			html += '<div class="' + volumeID + '"><div class="' + volumeDbgID + '"><div class="' + volumeBgID + '"><div class="' + volumeUpID + '"></div></div><div class="' + volumeBOID + '"><div class="' + volumeBWID + '"></div></div></div></div>'; //�������ڿ�,�������ڰ�ť
			html += '<div class="' + muteID + '" data-title="' + thisTemp.language['mute'] + '">' + this.newCanvas(muteID, bWidth, bHeight) + '</div>'; //������ť
			html += '<div class="' + escMuteID + '" data-title="' + thisTemp.language['escMute'] + '">' + this.newCanvas(escMuteID, bWidth, bHeight) + '</div>'; //�˳�������ť
			html += '<div class="' + dlineID + '-rc"></div>'; //�ָ���
			this.getByElement(controlBarID).innerHTML = html;
			//�������������ݽ���
			//��������������
			this.getByElement(timeProgressBgID).innerHTML = '<div class="' + loadProgressID + '"></div><div class="' + timeProgressID + '"></div>';
			this.getByElement(timeBOBGID).innerHTML = '<div class="' + timeBOID + '"><div class="' + timeBWID + '"></div></div>';
			//�������������ݽ���
			this.getByElement(pauseCenterID).innerHTML = this.newCanvas(pauseCenterID, 80, 80); //�����м���ͣ��ť
			this.getByElement(loadingID).innerHTML = this.newCanvas(loadingID, 60, 60); //�����м仺��ʱ��ʾ��ͼ��
			this.getByElement(errorTextID).innerHTML = this.language['error']; //��������ʱ��ʾ���ı���
			this.getByElement(logoID).innerHTML = this.vars['logo'] || this.logo; //����logo
			//CB:Object��ȫ�ֱ�������һЩȫ����Ҫ�õ���Ԫ��ͳһ����CB������
			var pd=this.PD;
			this.CB = {
				controlBarBg: this.getByElement(controlBarBgID,pd),
				controlBar: this.getByElement(controlBarID,pd),
				promptBg: this.getByElement(promptBgID,pd),
				prompt: this.getByElement(promptID,pd),
				timeProgressBg: this.getByElement(timeProgressBgID,pd),
				loadProgress: this.getByElement(loadProgressID,pd),
				timeProgress: this.getByElement(timeProgressID,pd),
				timeBoBg: this.getByElement(timeBOBGID,pd),
				timeButton: this.getByElement(timeBOID,pd),
				timeText: this.getByElement(timeTextID,pd),
				play: this.getByElement(playID,pd),
				front: this.getByElement(frontID,pd),
				next: this.getByElement(nextID,pd),
				pause: this.getByElement(pauseID,pd),
				definition: this.getByElement(definitionID,pd),
				definitionP: this.getByElement(definitionPID,pd),
				definitionLine: this.getByElement(dlineID + '-rb',pd),
				full: this.getByElement(fullID,pd),
				escFull: this.getByElement(escFullID,pd),
				mute: this.getByElement(muteID,pd),
				escMute: this.getByElement(escMuteID,pd),
				volume: this.getByElement(volumeID,pd),
				volumeBg: this.getByElement(volumeBgID,pd),
				volumeUp: this.getByElement(volumeUpID,pd),
				volumeBO: this.getByElement(volumeBOID,pd),
				pauseCenter: this.getByElement(pauseCenterID,pd),
				menu: this.getByElement(menuID),
				loading: this.getByElement(loadingID,pd),
				loadingCanvas: this.getByElement(loadingID + '-canvas',pd),
				errorText: this.getByElement(errorTextID,pd),
				logo: this.getByElement(logoID,pd),
				playLine: this.getByElement(dlineID + '-la',pd),
				frontLine: this.getByElement(dlineID + '-lb',pd),
				nextLine: this.getByElement(dlineID + '-lc',pd),
				fullLine: this.getByElement(dlineID + '-ra'),
				definitionLine: this.getByElement(dlineID + '-rb',pd),
				muteLine: this.getByElement(dlineID + '-rc',pd)
			};
			this.buttonWidth = {
				play: bWidth,
				full: bWidth,
				front: bWidth,
				next: bWidth,
				mute: bWidth
			};
			//�������Ԫ�ص���ʽ
			//����������
			this.css(controlBarBgID, {
				width: '100%',
				height: bHeight + 'px',
				backgroundColor: '#000000',
				position: 'absolute',
				bottom: '0px',
				filter: 'alpha(opacity:0.8)',
				opacity: '0.8',
				zIndex: '90'
			});
			//����������
			this.css(controlBarID, {
				width: '100%',
				height: bHeight + 'px',
				position: 'absolute',
				bottom: '0px',
				zIndex: '90'
			});
			//�м���ͣ��ť
			this.css(pauseCenterID, {
				width: '80px',
				height: '80px',
				borderRadius: '50%',
				position: 'absolute',
				display: 'none',
				cursor: 'pointer',
				zIndex: '100'
			});
			//loading
			this.css(loadingID, {
				width: '60px',
				height: '60px',
				position: 'absolute',
				display: 'none',
				zIndex: '100'
			});
			//�����ı���
			this.css(errorTextID, {
				width: '120px',
				height: '30px',
				lineHeight: '30px',
				color: '#FFFFFF',
				fontSize: '14px',
				textAlign: 'center',
				position: 'absolute',
				display: 'none',
				zIndex: '101',
				cursor: 'default',
				zIndex: '100'
			});
			//����logo���ֵ���ʽ
			this.css(logoID, {
				height: '30px',
				lineHeight: '30px',
				color: '#FFFFFF',
				fontFamily: 'Arial',
				fontSize: '28px',
				textAlign: 'center',
				position: 'absolute',
				float: 'left',
				left: '-1000px',
				top: '20px',
				zIndex: '100',
				filter: 'alpha(opacity:0.8)',
				opacity: '0.8',
				cursor: 'default'
			});

			this.css(this.CB['loadingCanvas'], {
				transform: 'rotate(0deg)',
				msTransform: 'rotate(0deg)',
				mozTransform: 'rotate(0deg)',
				webkitTransform: 'rotate(0deg)',
				oTransform: 'rotate(0deg)'
			});
			//������ʾ�����ʽ
			this.css([promptBgID, promptID], {
				height: '30px',
				lineHeight: '30px',
				color: '#FFFFFF',
				fontSize: '14px',
				textAlign: 'center',
				position: 'absolute',
				borderRadius: '5px',
				paddingLeft: '5px',
				paddingRight: '5px',
				bottom: '0px',
				display: 'none',
				zIndex: '95'
			});
			this.css(promptBgID, {
				backgroundColor: '#000000',
				filter: 'alpha(opacity:0.5)',
				opacity: '0.5'
			});
			//ʱ���������������
			this.css(timeProgressBgID, {
				width: '100%',
				height: '6px',
				backgroundColor: '#3F3F3F',
				overflow: 'hidden',
				position: 'absolute',
				bottom: '38px',
				zIndex: '88'
			});
			//���ؽ��Ⱥ�ʱ�����
			this.css([loadProgressID, timeProgressID], {
				width: '1px',
				height: '6px',
				position: 'absolute',
				bottom: '38px',
				top: '0px',
				zIndex: '91'
			});
			this.css(loadProgressID, 'backgroundColor', '#6F6F6F');
			this.css(timeProgressID, 'backgroundColor', bOverColor);
			//ʱ����Ȱ�ť
			this.css(timeBOBGID, {
				width: '100%',
				height: '14px',
				overflow: 'hidden',
				position: 'absolute',
				bottom: '34px',
				cursor: 'pointer',
				zIndex: '92'
			});
			this.css(timeBOID, {
				width: '14px',
				height: '14px',
				overflow: 'hidden',
				borderRadius: '50%',
				backgroundColor: bBgColor,
				cursor: 'pointer',
				position: 'absolute',
				top: '0px',
				zIndex: '20'
			});
			this.css(timeBWID, {
				width: '8px',
				height: '8px',
				overflow: 'hidden',
				borderRadius: '50%',
				position: 'absolute',
				backgroundColor: bOverColor,
				left: '3px',
				top: '3px'
			});
			this.css(timeTextID, {
				lineHeight: bHeight + 'px',
				color: '#FFFFFF',
				fontFamily: 'arial',
				fontSize: '16px',
				paddingLeft: '10px',
				float: 'left',
				overflow: 'hidden',
				cursor: 'default'
			});

			//�ָ���
			this.css([dlineID + '-la', dlineID + '-lb', dlineID + '-lc', dlineID + '-ra', dlineID + '-rb', dlineID + '-rc'], {
				width: '0px',
				height: bHeight + 'px',
				overflow: 'hidden',
				borderLeft: '1px solid #303030',
				borderRight: '1px solid #151515',
				filter: 'alpha(opacity:0.9)',
				opacity: '0.9'
			});
			this.css([dlineID + '-la', dlineID + '-lb', dlineID + '-lc'], 'float', 'left');
			this.css([dlineID + '-ra', dlineID + '-rb', dlineID + '-rc'], 'float', 'right');
			this.css([dlineID + '-lb', dlineID + '-lc', dlineID + '-rb'], 'display', 'none');
			//����/��ͣ/��һ��/��һ����ť
			this.css([playID, pauseID, frontID, nextID], {
				width: bWidth + 'px',
				height: bHeight + 'px',
				float: 'left',
				overflow: 'hidden',
				cursor: 'pointer'
			});
			this.css([frontID, nextID], 'display', 'none');
			//��ʼ���жϲ���/��ͣ��ť������
			this.initPlayPause();

			//���þ���/ȡ�������İ�ť��ʽ
			this.css([muteID, escMuteID], {
				width: bWidth + 'px',
				height: bHeight + 'px',
				float: 'right',
				overflow: 'hidden',
				cursor: 'pointer'
			});
			if(this.vars['volume'] > 0) {
				this.css(escMuteID, 'display', 'none');
			} else {
				this.css(muteID, 'display', 'none');
			}
			//�������ڿ�
			this.css([volumeID, volumeDbgID], {
				width: '110px',
				height: bHeight + 'px',
				overflow: 'hidden',
				float: 'right'
			});
			this.css(volumeDbgID, {
				position: 'absolute'
			});
			this.css([volumeBgID, volumeUpID], {
				width: '100px',
				height: '6px',
				overflow: 'hidden',
				borderRadius: '5px',
				cursor: 'pointer'
			});
			this.css(volumeBgID, {
				position: 'absolute',
				top: '16px'
			});
			this.css(volumeBgID, 'backgroundColor', '#666666');
			this.css(volumeUpID, 'backgroundColor', bOverColor);
			this.buttonWidth['volume'] = 100;
			//�������ڰ�ť
			this.css(volumeBOID, {
				width: '12px',
				height: '12px',
				overflow: 'hidden',
				borderRadius: '50%',
				position: 'absolute',
				backgroundColor: bBgColor,
				top: '13px',
				left: '0px',
				cursor: 'pointer'
			});
			this.css(volumeBWID, {
				width: '6px',
				height: '6px',
				overflow: 'hidden',
				borderRadius: '50%',
				position: 'absolute',
				backgroundColor: bOverColor,
				left: '3px',
				top: '3px'
			});
			//����������
			this.css(definitionID, {
				lineHeight: bHeight + 'px',
				color: '#FFFFFF',
				float: 'right',
				fontSize: '14px',
				textAlign: 'center',
				overflow: 'hidden',
				display: 'none',
				cursor: 'pointer'
			});
			this.css(definitionPID, {
				lineHeight: (bHeight - 8) + 'px',
				color: '#FFFFFF',
				overflow: 'hidden',
				position: 'absolute',
				bottom: '4px',
				backgroundColor: '#000000',
				textAlign: 'center',
				zIndex: '95',
				cursor: 'pointer',
				display: 'none'
			});
			//����ȫ��/�˳�ȫ����ť��ʽ
			this.css([fullID, escFullID], {
				width: bWidth + 'px',
				height: bHeight + 'px',
				float: 'right',
				overflow: 'hidden',
				cursor: 'pointer'
			});
			this.css(escFullID, 'display', 'none');
			//��������ť����״
			//���Ű�ť
			var cPlay = this.getByElement(playID + '-canvas').getContext('2d');
			var cPlayFillRect = function() {
				thisTemp.canvasFill(cPlay, [
					[12, 10],
					[29, 19],
					[12, 28]
				]);
			};
			cPlay.fillStyle = bBgColor;
			cPlayFillRect();
			var cPlayOver = function(event) {
				cPlay.clearRect(0, 0, bWidth, bHeight);
				cPlay.fillStyle = bOverColor;
				cPlayFillRect();
			};
			var cPlayOut = function(event) {
				cPlay.clearRect(0, 0, bWidth, bHeight);
				cPlay.fillStyle = bBgColor;
				cPlayFillRect();
			};

			this.addListener('mouseover', cPlayOver, this.getByElement(playID + '-canvas'));
			this.addListener('mouseout', cPlayOut, this.getByElement(playID + '-canvas'));
			//��ͣ��ť
			var cPause = this.getByElement(pauseID + '-canvas').getContext('2d');
			var cPauseFillRect = function() {
				thisTemp.canvasFillRect(cPause, [
					[10, 10, 5, 18],
					[22, 10, 5, 18]
				]);
			};
			cPause.fillStyle = bBgColor;
			cPauseFillRect();
			var cPauseOver = function(event) {
				cPause.clearRect(0, 0, bWidth, bHeight);
				cPause.fillStyle = bOverColor;
				cPauseFillRect();
			};
			var cPauseOut = function(event) {
				cPause.clearRect(0, 0, bWidth, bHeight);
				cPause.fillStyle = bBgColor;
				cPauseFillRect();
			};
			this.addListener('mouseover', cPauseOver, this.getByElement(pauseID + '-canvas'));
			this.addListener('mouseout', cPauseOut, this.getByElement(pauseID + '-canvas'));
			//ǰһ����ť
			var cFront = this.getByElement(frontID + '-canvas').getContext('2d');
			var cFrontFillRect = function() {
				thisTemp.canvasFill(cFront, [
					[16, 19],
					[30, 10],
					[30, 28]
				]);
				thisTemp.canvasFillRect(cFront, [
					[8, 10, 5, 18]
				]);
			};
			cFront.fillStyle = bBgColor;
			cFrontFillRect();
			var cFrontOver = function(event) {
				cFront.clearRect(0, 0, bWidth, bHeight);
				cFront.fillStyle = bOverColor;
				cFrontFillRect();
			};
			var cFrontOut = function(event) {
				cFront.clearRect(0, 0, bWidth, bHeight);
				cFront.fillStyle = bBgColor;
				cFrontFillRect();
			};

			this.addListener('mouseover', cFrontOver, this.getByElement(frontID + '-canvas'));
			this.addListener('mouseout', cFrontOut, this.getByElement(frontID + '-canvas'));
			//��һ����ť
			var cNext = this.getByElement(nextID + '-canvas').getContext('2d');
			var cNextFillRect = function() {
				thisTemp.canvasFill(cNext, [
					[8, 10],
					[22, 19],
					[8, 28]
				]);
				thisTemp.canvasFillRect(cNext, [
					[25, 10, 5, 18]
				]);
			};
			cNext.fillStyle = bBgColor;
			cNextFillRect();
			var cNextOver = function(event) {
				cNext.clearRect(0, 0, bWidth, bHeight);
				cNext.fillStyle = bOverColor;
				cNextFillRect();
			};
			var cNextOut = function(event) {
				cNext.clearRect(0, 0, bWidth, bHeight);
				cNext.fillStyle = bBgColor;
				cNextFillRect();
			};
			this.addListener('mouseover', cNextOver, this.getByElement(nextID + '-canvas'));
			this.addListener('mouseout', cNextOut, this.getByElement(nextID + '-canvas'));
			//ȫ����ť
			var cFull = this.getByElement(fullID + '-canvas').getContext('2d');
			var cFullFillRect = function() {
				thisTemp.canvasFillRect(cFull, [
					[19, 10, 9, 3],
					[25, 13, 3, 6],
					[10, 19, 3, 9],
					[13, 25, 6, 3]
				]);
			};
			cFull.fillStyle = bBgColor;
			cFullFillRect();
			var cFullOver = function() {
				cFull.clearRect(0, 0, bWidth, bHeight);
				cFull.fillStyle = bOverColor;
				cFullFillRect();
			};
			var cFullOut = function() {
				cFull.clearRect(0, 0, bWidth, bHeight);
				cFull.fillStyle = bBgColor;
				cFullFillRect();
			};
			this.addListener('mouseover', cFullOver, this.getByElement(fullID + '-canvas'));
			this.addListener('mouseout', cFullOut, this.getByElement(fullID + '-canvas'));
			//�����˳�ȫ����ť��ʽ
			var cEscFull = this.getByElement(escFullID + '-canvas').getContext('2d');
			var cEscFullFillRect = function() {
				thisTemp.canvasFillRect(cEscFull, [
					[20, 9, 3, 9],
					[23, 15, 6, 3],
					[9, 20, 9, 3],
					[15, 23, 3, 6]
				]);
			};
			cEscFull.fillStyle = bBgColor;
			cEscFullFillRect();

			var cEscFullOver = function() {
				cEscFull.clearRect(0, 0, bWidth, bHeight);
				cEscFull.fillStyle = bOverColor;
				cEscFullFillRect();
			};
			var cEscFullOut = function() {
				cEscFull.clearRect(0, 0, bWidth, bHeight);
				cEscFull.fillStyle = bBgColor;
				cEscFullFillRect();
			};
			this.addListener('mouseover', cEscFullOver, this.getByElement(escFullID + '-canvas'));
			this.addListener('mouseout', cEscFullOut, this.getByElement(escFullID + '-canvas'));
			//����ȫ����ť����ʽ
			var cMute = this.getByElement(muteID + '-canvas').getContext('2d');
			var cMuteFillRect = function() {
				thisTemp.canvasFill(cMute, [
					[10, 15],
					[15, 15],
					[21, 10],
					[21, 28],
					[15, 23],
					[10, 23]
				]);
				thisTemp.canvasFillRect(cMute, [
					[23, 15, 2, 8],
					[27, 10, 2, 18]
				]);
			};
			cMute.fillStyle = bBgColor;
			cMuteFillRect();
			var cMuteOver = function() {
				cMute.clearRect(0, 0, bWidth, bHeight);
				cMute.fillStyle = bOverColor;
				cMuteFillRect();
			};
			var cMuteOut = function() {
				cMute.clearRect(0, 0, bWidth, bHeight);
				cMute.fillStyle = bBgColor;
				cMuteFillRect();
			};
			this.addListener('mouseover', cMuteOver, this.getByElement(muteID + '-canvas'));
			this.addListener('mouseout', cMuteOut, this.getByElement(muteID + '-canvas'));
			//�����˳�ȫ����ť��ʽ
			var cEscMute = this.getByElement(escMuteID + '-canvas').getContext('2d');
			var cEscMuteFillRect = function() {
				thisTemp.canvasFill(cEscMute, [
					[10, 15],
					[15, 15],
					[21, 10],
					[21, 28],
					[15, 23],
					[10, 23]
				]);
				thisTemp.canvasFill(cEscMute, [
					[23, 13],
					[24, 13],
					[33, 25],
					[32, 25]
				]);
				thisTemp.canvasFill(cEscMute, [
					[32, 13],
					[33, 13],
					[24, 25],
					[23, 25]
				]);
			};
			cEscMute.fillStyle = bBgColor;
			cEscMuteFillRect();
			var cEscMuteOver = function() {
				cEscMute.clearRect(0, 0, bWidth, bHeight);
				cEscMute.fillStyle = bOverColor;
				cEscMuteFillRect();
			};
			var cEscMuteOut = function() {
				cEscMute.clearRect(0, 0, bWidth, bHeight);
				cEscMute.fillStyle = bBgColor;
				cEscMuteFillRect();
			};
			this.addListener('mouseover', cEscMuteOver, this.getByElement(escMuteID + '-canvas'));
			this.addListener('mouseout', cEscMuteOut, this.getByElement(escMuteID + '-canvas'));
			//����loading��ʽ
			var cLoading = this.getByElement(loadingID + '-canvas').getContext('2d');
			var cLoadingFillRect = function() {
				cLoading.save();
				var grad = cLoading.createLinearGradient(0, 0, 60, 60);
				grad.addColorStop(0, bBgColor);
				var grad2 = cLoading.createLinearGradient(0, 0, 80, 60);
				grad2.addColorStop(1, bOverColor);
				cLoading.strokeStyle = grad; //���������ʽ
				cLoading.lineWidth = 8; //�����߿�
				cLoading.beginPath(); //·����ʼ
				cLoading.arc(30, 30, 25, 0.25 * Math.PI, 2 * Math.PI, false); //���ڻ���Բ��context.arc(x���꣬y���꣬�뾶����ʼ�Ƕȣ���ֹ�Ƕȣ�˳ʱ��/��ʱ��)
				cLoading.stroke(); //����
				cLoading.closePath(); //·������
				cLoading.beginPath(); //·����ʼ
				cLoading.strokeStyle = grad2; //���������ʽ
				cLoading.arc(30, 30, 25, 0, 0.25 * Math.PI, false); //���ڻ���Բ��context.arc(x���꣬y���꣬�뾶����ʼ�Ƕȣ���ֹ�Ƕȣ�˳ʱ��/��ʱ��)
				cLoading.stroke(); //����
				cLoading.closePath(); //·������
				cLoading.restore();
			};
			cLoading.fillStyle = bBgColor;
			cLoadingFillRect();
			//�����м���ͣ��ť����ʽ
			var cPauseCenter = this.getByElement(pauseCenterID + '-canvas').getContext('2d');
			var cPauseCenterFillRect = function() {
				thisTemp.canvasFill(cPauseCenter, [
					[28, 22],
					[59, 38],
					[28, 58]
				]);
				/* ָ��������ɫ */
				cPauseCenter.save();
				cPauseCenter.lineWidth = 5; //�����߿�
				cPauseCenter.beginPath(); //·����ʼ
				cPauseCenter.arc(40, 40, 35, 0, 2 * Math.PI, false); //���ڻ���Բ��context.arc(x���꣬y���꣬�뾶����ʼ�Ƕȣ���ֹ�Ƕȣ�˳ʱ��/��ʱ��)
				cPauseCenter.stroke(); //����
				cPauseCenter.closePath(); //·������
				cPauseCenter.restore();
			};
			cPauseCenter.fillStyle = bBgColor;
			cPauseCenter.strokeStyle = bBgColor;
			cPauseCenterFillRect();
			var cPauseCenterOver = function() {
				cPauseCenter.clearRect(0, 0, 80, 80);
				cPauseCenter.fillStyle = bOverColor;
				cPauseCenter.strokeStyle = bOverColor;
				cPauseCenterFillRect();
			};
			var cPauseCenterOut = function() {
				cPauseCenter.clearRect(0, 0, 80, 80);
				cPauseCenter.fillStyle = bBgColor;
				cPauseCenter.strokeStyle = bBgColor;
				cPauseCenterFillRect();
			};
			this.addListener('mouseover', cPauseCenterOver, this.getByElement(pauseCenterID + '-canvas'));
			this.addListener('mouseout', cPauseCenterOut, this.getByElement(pauseCenterID + '-canvas'));

			//��꾭��/�뿪�������ڰ�ť
			var volumeBOOver = function() {
				thisTemp.css(volumeBOID, 'backgroundColor', bOverColor);
				thisTemp.css(volumeBWID, 'backgroundColor', bBgColor);
			};
			var volumeBOOut = function() {
				thisTemp.css(volumeBOID, 'backgroundColor', bBgColor);
				thisTemp.css(volumeBWID, 'backgroundColor', bOverColor);
			};
			this.addListener('mouseover', volumeBOOver, this.getByElement(volumeBOID));
			this.addListener('mouseout', volumeBOOut, this.getByElement(volumeBOID));
			//��꾭��/�뿪���Ȱ�ť
			var timeBOOver = function() {
				thisTemp.css(timeBOID, 'backgroundColor', bOverColor);
				thisTemp.css(timeBWID, 'backgroundColor', bBgColor);
			};
			var timeBOOut = function() {
				thisTemp.css(timeBOID, 'backgroundColor', bBgColor);
				thisTemp.css(timeBWID, 'backgroundColor', bOverColor);
			};
			this.addListener('mouseover', timeBOOver, this.getByElement(timeBOID));
			this.addListener('mouseout', timeBOOut, this.getByElement(timeBOID));

			this.addButtonEvent(); //ע�ᰴť���������ڣ����Ȳ����¼�
			this.newMenu(); //���������Ҽ�����ʽ���¼�
			this.controlBarHide(); //����ע������������¼�
			this.keypress(); //����ע������¼�
			//��ʼ���������ڿ�
			this.changeVolume(this.vars['volume']);
			//��ʼ���ж��Ƿ���Ҫ��ʾ��һ������һ����ť
			this.showFrontNext();
			window.setTimeout(function() {
				thisTemp.elementCoordinate(); //�����м���ͣ��ť/loading��λ��/error��λ��
			}, 100);
			this.checkBarWidth();
			var resize = function() {
				thisTemp.elementCoordinate();
				thisTemp.timeUpdateHandler();
				thisTemp.changeLoad();
				thisTemp.checkBarWidth();
				thisTemp.changeElementCoor(); //�޸��¼�Ԫ��������
				thisTemp.changePrompt();
			};
			this.addListener('resize', resize, window);
		},
		/*
			�ڲ�����
			������ť��ʹ��canvas����
		*/
		newCanvas: function(id, width, height) {
			return '<canvas class="' + id + '-canvas" width="' + width + '" height="' + height + '"></canvas>';
		},
		/*
			�ڲ�����
			ע�ᰴť���������ڿ򣬽��Ȳ������¼�
		*/
		addButtonEvent: function() {
			var thisTemp = this;
			//���尴ť�ĵ����¼�
			var playClick = function(event) {
				thisTemp.play();
			};
			this.addListener('click', playClick, this.CB['play']);
			this.addListener('click', playClick, this.CB['pauseCenter']);
			var pauseClick = function(event) {
				thisTemp.pause();
			};
			this.addListener('click', pauseClick, this.CB['pause']);
			var frontClick = function(event) {
				if(thisTemp.vars['front']) {
					eval(thisTemp.vars['front'] + '()');
				}
			};
			this.addListener('click', frontClick, this.CB['front']);
			var nextClick = function(event) {
				if(thisTemp.vars['next']) {
					eval(thisTemp.vars['next'] + '()');
				}
			};
			this.addListener('click', nextClick, this.CB['next']);
			var muteClick = function(event) {
				thisTemp.changeVolumeTemp = thisTemp.V ? (thisTemp.V.volume > 0 ? thisTemp.V.volume : thisTemp.vars['volume']) : thisTemp.vars['volume'];
				thisTemp.changeVolume(0);
			};
			this.addListener('click', muteClick, this.CB['mute']);
			var escMuteClick = function(event) {
				thisTemp.changeVolume(thisTemp.changeVolumeTemp > 0 ? thisTemp.changeVolumeTemp : thisTemp.vars['volume']);
			};
			this.addListener('click', escMuteClick, this.CB['escMute']);
			var fullClick = function(event) {
				thisTemp.fullScreen();
			};
			this.addListener('click', fullClick, this.CB['full']);
			var escFullClick = function(event) {
				thisTemp.quitFullScreen();
			};
			this.addListener('click', escFullClick, this.CB['escFull']);
			//���������ť����꾭��/�뿪�¼�
			var promptHide = function(event) {
				thisTemp.promptShow(false);
			};
			var playOver = function(event) {
				thisTemp.promptShow(thisTemp.CB['play']);
			};
			this.addListener('mouseover', playOver, this.CB['play']);
			this.addListener('mouseout', promptHide, this.CB['play']);
			var pauseOver = function(event) {
				thisTemp.promptShow(thisTemp.CB['pause']);
			};
			this.addListener('mouseover', pauseOver, this.CB['pause']);
			this.addListener('mouseout', promptHide, this.CB['pause']);
			var frontOver = function(event) {
				thisTemp.promptShow(thisTemp.CB['front']);
			};
			this.addListener('mouseover', frontOver, this.CB['front']);
			this.addListener('mouseout', promptHide, this.CB['front']);
			var nextOver = function(event) {
				thisTemp.promptShow(thisTemp.CB['next']);
			};
			this.addListener('mouseover', nextOver, this.CB['next']);
			this.addListener('mouseout', promptHide, this.CB['next']);
			var muteOver = function(event) {
				thisTemp.promptShow(thisTemp.CB['mute']);
			};
			this.addListener('mouseover', muteOver, this.CB['mute']);
			this.addListener('mouseout', promptHide, this.CB['mute']);
			var escMuteOver = function(event) {
				thisTemp.promptShow(thisTemp.CB['escMute']);
			};
			this.addListener('mouseover', escMuteOver, this.CB['escMute']);
			this.addListener('mouseout', promptHide, this.CB['escMute']);
			var fullOver = function(event) {
				thisTemp.promptShow(thisTemp.CB['full']);
			};
			this.addListener('mouseover', fullOver, this.CB['full']);
			this.addListener('mouseout', promptHide, this.CB['full']);
			var escFullOver = function(event) {
				thisTemp.promptShow(thisTemp.CB['escFull']);
			};
			this.addListener('mouseover', escFullOver, this.CB['escFull']);
			this.addListener('mouseout', promptHide, this.CB['escFull']);
			var definitionOver = function(event) {
				thisTemp.promptShow(thisTemp.CB['definition']);
			};
			this.addListener('mouseover', definitionOver, this.CB['definition']);
			this.addListener('mouseout', promptHide, this.CB['definition']);
			//���������ͽ��Ȱ�ť�Ļ����¼�

			var volumePrompt = function(vol) {
				var volumeBOXY = thisTemp.getCoor(thisTemp.CB['volumeBO']);
				var promptObj = {
					title: thisTemp.language['volume'] + vol + '%',
					x: volumeBOXY['x'] + thisTemp.CB['volumeBO'].offsetWidth * 0.5,
					y: volumeBOXY['y']
				};
				thisTemp.promptShow(false, promptObj);
			};
			var volumeObj = {
				slider: this.CB['volumeBO'],
				follow: this.CB['volumeUp'],
				refer: this.CB['volumeBg'],
				grossValue: 'volume',
				pd: true,
				startFun: function(vol) {},
				monitorFun: function(vol) {
					thisTemp.changeVolume(vol * 0.01, false, false);
					volumePrompt(vol);
				},
				endFun: function(vol) {},
				overFun: function(vol) {
					volumePrompt(vol);
				}
			};
			this.slider(volumeObj);
			var volumeClickObj = {
				refer: this.CB['volumeBg'],
				grossValue: 'volume',
				fun: function(vol) {
					thisTemp.changeVolume(vol * 0.01, true, true);
				}
			};
			this.progressClick(volumeClickObj);
			this.timeButtonMouseDown(); //�õ����ĺ������ж��Ƿ���Ҫ��������������
			//��꾭��/�뿪�������ڿ�ʱ��
			var volumeBgMove = function(event) {
				var volumeBgXY = thisTemp.getCoor(thisTemp.CB['volumeBg']);
				var eventX = thisTemp.client(event)['x'];
				var eventVolume = parseInt((eventX -volumeBgXY['x']) * 100 / thisTemp.CB['volumeBg'].offsetWidth);
				var buttonPromptObj = {
					title: thisTemp.language['volume'] + eventVolume + '%',
					x: eventX,
					y: volumeBgXY['y']
				};
				thisTemp.promptShow(false, buttonPromptObj);
			};
			this.addListener('mousemove', volumeBgMove, this.CB['volumeBg']);
			this.addListener('mouseout', promptHide, this.CB['volumeBg']);
			this.addListener('mouseout', promptHide, this.CB['volumeBO']);
			//ע������������¼�
			this.addDefListener();
		},
		/*
			�ڲ�����
			ע�ᵥ����Ƶ����
		*/
		videoClick: function() {
			var thisTemp = this;
			var clearTimerClick = function() {
				if(thisTemp.timerClick != null) {
					if(thisTemp.timerClick.runing) {
						thisTemp.timerClick.stop();
					}
					thisTemp.timerClick = null;
				}
			};
			var timerClickFun = function() {
				clearTimerClick();
				thisTemp.isClick = false;
				thisTemp.playOrPause();

			};
			clearTimerClick();
			if(this.isClick) {
				this.isClick = false;
				if(thisTemp.config['videoDbClick']) {
					if(!this.full) {
						thisTemp.fullScreen();
					} else {
						thisTemp.quitFullScreen();
					}
				}

			} else {
				this.isClick = true;
				this.timerClick = new this.timer(300, timerClickFun, 1)
				//this.timerClick.start();
			}

		},
		/*
			�ڲ�����
			ע����꾭�����Ȼ�����¼�
		*/
		timeButtonMouseDown: function() {
			var thisTemp = this;
			var timePrompt = function(time) {
				if(isNaN(time)) {
					time = 0;
				}
				var timeButtonXY = thisTemp.getCoor(thisTemp.CB['timeButton']);
				var promptObj = {
					title: thisTemp.formatTime(time),
					x: timeButtonXY['x'] - thisTemp.pdCoor['x'] + thisTemp.CB['timeButton'].offsetWidth * 0.5,
					y: timeButtonXY['y'] - thisTemp.pdCoor['y']
				};
				thisTemp.promptShow(false, promptObj);
			};
			var timeObj = {
				slider: this.CB['timeButton'],
				follow: this.CB['timeProgress'],
				refer: this.CB['timeBoBg'],
				grossValue: 'time',
				pd: false,
				startFun: function(time) {
					thisTemp.isTimeButtonMove = false;
				},
				monitorFun: function(time) {},
				endFun: function(time) {
					if(thisTemp.V) {
						if(thisTemp.V.duration > 0) {
							thisTemp.needSeek = 0;
							thisTemp.seek(parseInt(time));
						}
					}
				},
				overFun: function(time) {
					timePrompt(time);
				},
			};
			var timeClickObj = {
				refer: this.CB['timeBoBg'],
				grossValue: 'time',
				fun: function(time) {
					if(thisTemp.V) {
						if(thisTemp.V.duration > 0) {
							thisTemp.needSeek = 0;
							thisTemp.seek(parseInt(time));
						}
					}
				},
			};
			var timeBoBgmousemove = function(event) {
				var timeBoBgXY = thisTemp.getCoor(thisTemp.CB['timeBoBg']);
				var eventX = thisTemp.client(event)['x'];
				var eventTime = parseInt((eventX - timeBoBgXY['x']) * thisTemp.V.duration / thisTemp.CB['timeBoBg'].offsetWidth);
				var buttonPromptObj = {
					title: thisTemp.formatTime(eventTime),
					x: eventX,
					y: timeBoBgXY['y']
				};
				thisTemp.promptShow(false, buttonPromptObj);
				var def = false;
				if(!thisTemp.isUndefined(thisTemp.CB['definitionP'])) {
					if(thisTemp.css(thisTemp.CB['definitionP'], 'display') != 'block') {
						def = true;
					}
				}
				if(thisTemp.vars['preview'] != null && def) {
					buttonPromptObj['time'] = eventTime;
					thisTemp.preview(buttonPromptObj);
				}
			};
			var promptHide = function(event) {
				thisTemp.promptShow(false);
				if(thisTemp.previewDiv != null) {
					thisTemp.css([thisTemp.previewDiv, thisTemp.previewTop], 'display', 'none');
				}
			};
			if(!this.vars['live']) { //�������ֱ��
				this.isTimeButtonDown = true;
				this.addListener('mousemove', timeBoBgmousemove, this.CB['timeBoBg']);
				this.addListener('mouseout', promptHide, this.CB['timeBoBg']);
			} else {
				this.isTimeButtonDown = false;
				timeObj['removeListener'] = true;
				timeClickObj['removeListener'] = true;
			}
			this.slider(timeObj);
			this.progressClick(timeClickObj);
		},
		/*
			�ڲ�����
			ע����ڿ��ϵ����¼��������������ڿ�Ͳ���ʱ�ȵ��ڿ�
		*/
		progressClick: function(obj) {
			/*
				refer:�ο�����
				fun:���غ���
				refer:�ο�Ԫ�أ�������
				grossValue:���õĲο�ֵ����
				pd:
			*/
			//�����ο�Ԫ�ص�mouseClick�¼���������Ϊ��������ϰ���ʱ������״̬
			var thisTemp = this;
			var referMouseClick = function(event) {
				var referX = thisTemp.client(event)['x']-thisTemp.getCoor(obj['refer'])['x'];
				var rWidth = obj['refer'].offsetWidth;
				var grossValue = 0;
				if(obj['grossValue'] == 'volume') {
					grossValue = 100;
				} else {
					if(thisTemp.V) {
						grossValue = thisTemp.V.duration;
					}
				}
				var nowZ = parseInt(referX * grossValue / rWidth);
				if(obj['fun']) {
					obj['fun'](nowZ);
				}
			};
			if(this.isUndefined(obj['removeListener'])) {
				this.addListener('click', referMouseClick, obj['refer']);
			} else {
				this.removeListener('click', referMouseClick, obj['refer']);
			}

		},

		/*
			�ڲ�����
			���õ�ע�Ử���¼�
		*/
		slider: function(obj) {
			/*
				obj={
					slider:����Ԫ��
					follow:���滬���Ԫ��
					refer:�ο�Ԫ�أ�������
					grossValue:���õĲο�ֵ����
					startFun:��ʼ���õ�Ԫ��
					monitorFun:��������
					endFun:�������õĺ���
					overFun:������ȥ����õĺ���
					pd:�Ƿ���Ҫ����
				}
			*/
			var thisTemp = this;
			var clientX = 0,
				criterionWidth = 0,
				sliderLeft = 0,
				referLeft = 0;
			var value = 0;
			var calculation = function() { //���ݻ����left����ٷֱ�
				var sLeft = parseInt(thisTemp.css(obj['slider'], 'left'));
				var rWidth = obj['refer'].offsetWidth - obj['slider'].offsetWidth;
				var grossValue = 0;
				if(thisTemp.isUndefined(sLeft) || isNaN(sLeft)) {
					sLeft = 0;
				}
				if(obj['grossValue'] == 'volume') {
					grossValue = 100;
				} else {
					if(thisTemp.V) {
						grossValue = thisTemp.V.duration;
					}
				}
				return parseInt(sLeft * grossValue / rWidth);
			};
			var mDown = function(event) {
				thisTemp.addListener('mousemove', mMove, document);
				thisTemp.addListener('mouseup', mUp, document);
				var referXY = thisTemp.getCoor(obj['refer']);
				var sliderXY = thisTemp.getCoor(obj['slider']);
				clientX = thisTemp.client(event)['x'];
				referLeft = referXY['x'];
				sliderLeft = sliderXY['x'];
				criterionWidth = clientX - sliderLeft;
				if(obj['startFun']) {
					obj['startFun'](calculation());
				}
			};
			var mMove = function(event) {
				clientX = thisTemp.client(event)['x'];
				var newX = clientX - criterionWidth - referLeft;
				if(newX < 0) {
					newX = 0;
				}
				if(newX > obj['refer'].offsetWidth - obj['slider'].offsetWidth) {
					newX = obj['refer'].offsetWidth - obj['slider'].offsetWidth;
				}
				thisTemp.css(obj['slider'], 'left', newX + 'px');
				thisTemp.css(obj['follow'], 'width', (newX + obj['slider'].offsetWidth * 0.5) + 'px');
				var nowZ = calculation();
				if(obj['monitorFun']) {
					obj['monitorFun'](nowZ);
				}
			};
			var mUp = function(event) {
				thisTemp.removeListener('mousemove', mMove, document);
				thisTemp.removeListener('mouseup', mUp, document);
				if(obj['endFun']) {
					obj['endFun'](calculation());
				}
			};
			var mOver = function(event) {
				if(obj['overFun']) {
					obj['overFun'](calculation());
				}

			};
			if(this.isUndefined(obj['removeListener'])) {
				this.addListener('mousedown', mDown, obj['slider']);
				this.addListener('mouseover', mOver, obj['slider']);
			} else {
				this.removeListener('mousedown', mDown, obj['slider']);
				this.removeListener('mouseover', mOver, obj['slider']);
			}
		},
		/*
			�ڲ�����
			��ʾloading
		*/
		loadingStart: function(rot) {
			var thisTemp = this;
			if(this.isUndefined(rot)) {
				rot = true;
			}
			this.css(thisTemp.CB['loading'], 'display', 'none');
			if(this.timerLoading != null) {
				if(this.timerLoading.runing) {
					this.timerLoading.stop();
				}
				this.timerLoading = null;
			}
			var loadingFun = function() {
				var nowRotate = '0';
				try {
					nowRotate = thisTemp.css(thisTemp.CB['loadingCanvas'], 'transform') || thisTemp.css(thisTemp.CB['loadingCanvas'], '-ms-transform') || thisTemp.css(thisTemp.CB['loadingCanvas'], '-moz-transform') || thisTemp.css(thisTemp.CB['loadingCanvas'], '-webkit-transform') || thisTemp.css(thisTemp.CB['loadingCanvas'], '-o-transform') || '0';
				} catch(event) {}
				nowRotate = parseInt(nowRotate.replace('rotate(', '').replace('deg);', ''));
				nowRotate += 4;
				if(nowRotate > 360) {
					nowRotate = 0;
				}
				thisTemp.css(thisTemp.CB['loadingCanvas'], {
					transform: 'rotate(' + nowRotate + 'deg)',
					msTransform: 'rotate(' + nowRotate + 'deg)',
					mozTransform: 'rotate(' + nowRotate + 'deg)',
					webkitTransform: 'rotate(' + nowRotate + 'deg)',
					oTransform: 'rotate(' + nowRotate + 'deg)'
				});
			};
			if(rot) {
				this.timerLoading = new this.timer(10, loadingFun);
				//this.timerLoading.start();
				this.css(thisTemp.CB['loading'], 'display', 'block');
			}

		},
		/*
			�ڲ�����
			�ж��Ƿ���Ҫ��ʾ��һ������һ��
		*/
		showFrontNext: function() {
			if(this.vars['front']) {
				this.css([this.CB['front'], this.CB['frontLine']], 'display', 'block');
			} else {
				this.css([this.CB['front'], this.CB['frontLine']], 'display', 'none');
			}
			if(this.vars['next']) {
				this.css([this.CB['next'], this.CB['nextLine']], 'display', 'block');
			} else {
				this.css([this.CB['next'], this.CB['nextLine']], 'display', 'none');
			}
		},
		/*
			�ڲ�����
			��ʾ��ʾ��
		*/
		promptShow: function(ele, data) {
			var obj = {};
			if(ele || data) {
				if(!this.isUndefined(data)) {
					obj = data;
				} else {
					var offsetCoor = this.getCoor(ele);
					obj = {
						title: ele.dataset.title,
						x: offsetCoor['x'] + ele.offsetWidth * 0.5,
						y: offsetCoor['y']
					};
				}
				this.CB['prompt'].innerHTML = obj['title'];
				this.css(this.CB['prompt'], 'display', 'block');
				var promoptWidth = this.getStringLen(obj['title']) * 10;
				this.css(this.CB['promptBg'], 'width', promoptWidth + 'px');
				this.css(this.CB['prompt'], 'width', promoptWidth + 'px');
				promoptWidth += 10;
				var x = obj['x'] - (promoptWidth * 0.5);
				var y = this.PD.offsetHeight - obj['y'] + 8;
				if(x < 0) {
					x = 0;
				}
				if(x > this.PD.offsetWidth - promoptWidth) {
					x = this.PD.offsetWidth - promoptWidth;
				}
				this.css([this.CB['promptBg'], this.CB['prompt']], {
					display: 'block',
					left: x + 'px',
					bottom: y + 'px'
				});
			} else {
				this.css([this.CB['promptBg'], this.CB['prompt']], {
					display: 'none'
				});
			}
		},
		/*
			�ڲ�����
			��������
		*/
		timerErrorFun: function() {
			var thisTemp = this;
			var clearIntervalError = function(event) {
				if(thisTemp.timerError != null) {
					if(thisTemp.timerError.runing) {
						thisTemp.timerError.stop();
					}
					thisTemp.timerError = null;
				}
			};
			var errorFun = function(event) {
				clearIntervalError();
				thisTemp.error = true;
				//��ȡ���󲥷ŵ�ַ
				thisTemp.errorUrl = thisTemp.getVideoUrl();
				//��ȡ���󲥷ŵ�ַ����
				thisTemp.addListenerError();
				thisTemp.css(thisTemp.CB['errorText'], 'display', 'block');
				thisTemp.css(thisTemp.CB['pauseCenter'], 'display', 'none');
				thisTemp.css(thisTemp.CB['loading'], 'display', 'none');
				thisTemp.V.removeAttribute('poster');
				thisTemp.resetPlayer();
			};
			var errorListenerFun = function(event) {
				window.setTimeout(function() {
					if(isNaN(thisTemp.V.duration)) {
						errorFun(event);
					}
				}, 500);

			};
			this.addListener('error', errorListenerFun, this.V);
			clearIntervalError();
			var timerErrorFun = function() {
				if(thisTemp.V && parseInt(thisTemp.V.networkState) == 3) {
					errorFun();
				}
			};
			this.timerError = new this.timer(this.config['errorTime'], timerErrorFun);
			//this.timerError.start();
		},
		/*
			�ڲ�����
			�����ж�ȫ�����Ƿ�ȫ�����ж�
		*/
		judgeFullScreen: function() {
			var thisTemp = this;
			if(this.timerFull != null) {
				if(this.timerFull.runing) {
					this.timerFull.stop();
				}
				this.timerFull = null;
			}
			var fullFun = function() {
				thisTemp.isFullScreen();
			};
			this.timerFull = new this.timer(20, fullFun);
			//this.timerFull.start();
		},
		/*
			�ڲ�����
			�ж��Ƿ���ȫ��
		*/
		isFullScreen: function() {
			var controlbarbgW = this.CB['controlBarBg'].offsetWidth;
			var containerW = this.CD.offsetWidth;
			if(controlbarbgW != containerW && !this.full) {
				this.full = true;
				this.addListenerFull();
				this.elementCoordinate();
				this.css(this.CB['full'], 'display', 'none');
				this.css(this.CB['escFull'], 'display', 'block');
				if(this.vars['live'] == 0) {
					this.timeUpdateHandler();
				}
				this.PD.appendChild(this.CB['menu']);
			}
			if(controlbarbgW == containerW && this.full) {
				this.full = false;
				this.addListenerFull();
				this.elementCoordinate();
				this.css(this.CB['full'], 'display', 'block');
				this.css(this.CB['escFull'], 'display', 'none');
				if(this.timerFull != null) {
					if(this.timerFull.runing) {
						this.timerFull.stop();
					}
					this.timerFull = null;
				}
				if(this.vars['live'] == 0) {
					this.timeUpdateHandler();
				}
				this.body.appendChild(this.CB['menu']);
			}
		},
		/*
			�ڲ�����
			�����Ҽ����ݼ�ע����ض����¼�
		*/
		newMenu: function() {
			var thisTemp = this;
			var i = 0;
			this.css(this.CB['menu'], {
				backgroundColor: '#FFFFFF',
				padding: '5px',
				position: 'absolute',
				left: '10px',
				top: '20px',
				display: 'none',
				zIndex: '999',
				color: '#A1A9BE',
				boxShadow: '2px 2px 3px #AAAAAA'
			});
			var mArr = this.contextMenu;
			var html = '';
			for(i = 0; i < mArr.length; i++) {
				var me = mArr[i];
				switch(me[1]) {
					case 'default':
						html += '<p>' + me[0] + '</p>';
						break;
					case 'link':
						html += '<p><a href="' + me[2] + '" target="_blank">' + me[0] + '</a></p>';
						break;
					case 'javascript':
						html += '<p><a href="javascript:' + me[2] + '()">' + me[0] + '</a></p>';
						break;
					case 'function':
						html += '<p><a href="javascript:' + this.vars['variable'] + '.' + me[2] + '()">' + me[0] + '</a></p>';
						break;
					default:
						break;
				}
			}
			this.CB['menu'].innerHTML = html;
			var pArr = this.CB['menu'].childNodes;
			for(i = 0; i < pArr.length; i++) {
				this.css(pArr[i], {
					height: '30px',
					lineHeight: '30px',
					margin: '0px',
					fontFamily: '"Microsoft YaHei", YaHei, "΢���ź�", SimHei,"\5FAE\8F6F\96C5\9ED1", "����",Arial',
					fontSize: '12px',
					paddingLeft: '10px',
					paddingRight: '30px'
				});
				if(mArr[i].length >= 4) {
					if(mArr[i][3] == 'line') {
						this.css(pArr[i], 'borderTop', '1px solid #e9e9e9');
					}
				}
				var aArr = pArr[i].childNodes;
				for(var n = 0; n < aArr.length; n++) {
					if(aArr[n].localName == 'a') {
						this.css(aArr[n], {
							color: '#000000',
							textDecoration: 'none'
						});
					}
				}
			}
			this.PD.oncontextmenu = function(event) {
				var eve = event || window.event;
				var client = thisTemp.client(event);
				if(eve.button == 2) {
					eve.returnvalue = false;
					var x = client['x'] + thisTemp.pdCoor['x'] - 2;
					var y = client['y'] + thisTemp.pdCoor['y'] - 2;
					thisTemp.css(thisTemp.CB['menu'], {
						display: 'block',
						left: x + 'px',
						top: y + 'px'
					});
					return false;
				}
				return true;
			};
			var setTimeOutPClose = function() {
				if(setTimeOutP) {
					window.clearTimeout(setTimeOutP);
					setTimeOutP = null;
				}
			};
			var setTimeOutP = null;
			var mouseOut = function(event) {
				setTimeOutPClose();
				setTimeOutP = window.setTimeout(function(event) {
					thisTemp.css(thisTemp.CB['menu'], 'display', 'none');
				}, 500);
			};
			this.addListener('mouseout', mouseOut, thisTemp.CB['menu']);
			var mouseOver = function(event) {
				setTimeOutPClose();
			};
			this.addListener('mouseover', mouseOver, thisTemp.CB['menu']);

		},
		/*
			�ڲ�����
			���������������¼�
		*/
		controlBarHide: function() {
			var thisTemp = this;
			var client = { x: 0, y: 0 },
				oldClient = { x: 0, y: 0 };
			var cShow = true;
			var oldCoor = [0, 0];
			var controlBarShow = function(show) {
				if(show && !cShow) {
					cShow = true;
					thisTemp.css(thisTemp.CB['controlBarBg'], 'display', 'block');
					thisTemp.css(thisTemp.CB['controlBar'], 'display', 'block');
					thisTemp.css(thisTemp.CB['timeProgressBg'], 'display', 'block');
					thisTemp.css(thisTemp.CB['timeBoBg'], 'display', 'block');
				} else {
					if(cShow) {
						cShow = false;
						var paused = thisTemp.getMetaDate()['paused'];
						if(!paused) {
							thisTemp.css(thisTemp.CB['controlBarBg'], 'display', 'none');
							thisTemp.css(thisTemp.CB['controlBar'], 'display', 'none');
							thisTemp.css(thisTemp.CB['timeProgressBg'], 'display', 'none');
							thisTemp.css(thisTemp.CB['timeBoBg'], 'display', 'none');
							thisTemp.promptShow(false);

						}
					}
				}
			};
			var cbarFun = function(event) {
				if(client['x'] == oldClient['x'] && client['y'] == oldClient['y']) {
					var cdH = parseInt(thisTemp.CD.offsetHeight);
					if((client['y'] < cdH - 50 || client['y'] > cdH - 2) && cShow) {
						controlBarShow(false);
					}
				} else {
					if(!cShow) {
						controlBarShow(true);
					}
				}
				oldClient = { x: client['x'], y: client['y'] }
			};
			this.timerCBar = new this.timer(2000, cbarFun);
			var cdMove = function(event) {
				var getClient = thisTemp.client(event);
				client['x'] = getClient['x'];
				client['y'] = getClient['y'];
				if(!cShow) {
					controlBarShow(true);
				}
			};
			this.addListener('mousemove', cdMove, thisTemp.CD);
			this.addListener('ended', cdMove);
			this.addListener('resize', cdMove, window);
		},
		/*
			�ڲ�����
			ע����̰����¼�
		*/
		keypress: function() {
			var thisTemp = this;
			var keyDown = function(eve) {
				var keycode = eve.keyCode || eve.which;
				var now = 0;
				switch(keycode) {
					case 32:
						thisTemp.playOrPause();
						break;
					case 37:
						now = thisTemp.time - 10;
						thisTemp.seek(now < 0 ? 0 : now);
						break;
					case 39:
						now = thisTemp.time + 10;
						thisTemp.seek(now);
						break;
					case 38:
						now = thisTemp.volume + 0.1;
						thisTemp.changeVolume(now > 1 ? 1 : now);
						break;
					case 40:
						now = thisTemp.volume - 0.1;
						thisTemp.changeVolume(now < 0 ? 0 : now);
						break;
					default:
						break;
				}
			};
			this.addListener('keydown', keyDown, window || document);
		},

		/*
			�ڲ�����
			���������Ȱ�ť���л��¼�(Click�¼�)
		*/
		definition: function() {
			var thisTemp = this;
			var vArr = this.VA;
			var dArr = [];
			var html = '';
			var nowD = ''; //��ǰ��������
			var i = 0;
			for(i = 0; i < vArr.length; i++) {
				var d = vArr[i][2];
				if(dArr.indexOf(d) == -1) {
					dArr.push(d);
				}
				if(this.V) {
					if(vArr[i][0] == this.V.currentSrc) {
						nowD = d;
					}
				}
			}
			if(!nowD) {
				nowD = dArr[0];
			}
			if(dArr.length > 1) {
				var zlen = 0;
				for(i = 0; i < dArr.length; i++) {
					html = '<p>' + dArr[i] + '</p>' + html;
					var dlen = this.getStringLen(dArr[i]);
					if(dlen > zlen) {
						zlen = dlen;
					}
				}
				if(html) {
					html += '<p>' + nowD + '</p>';
				}
				this.CB['definition'].innerHTML = nowD;
				this.CB['definitionP'].innerHTML = html;
				this.css([this.CB['definition'], this.CB['definitionLine']], 'display', 'block');
				var pArr = this.CB['definitionP'].childNodes;
				for(var i = 0; i < pArr.length; i++) {
					var fontColor = '#FFFFFF';
					if(pArr[i].innerHTML == nowD) {
						fontColor = '#0782F5';
					}
					this.css(pArr[i], {
						color: fontColor,
						margin: '0px',
						padding: '0px',
						fontSize: '14px'
					});
					if(i < pArr.length - 1) {
						this.css(pArr[i], 'borderBottom', '1px solid #282828')
					}
					var defClick = function() {
						if(nowD != this.innerHTML) {
							thisTemp.css(thisTemp.CB['definitionP'], 'display', 'none');
							thisTemp.newDefinition(this.innerHTML);
						}
					};
					this.addListener('click', defClick, pArr[i]);

				}
				var pW = (zlen * 10) + 20;
				this.css(this.CB['definitionP'], {
					width: pW + 'px'
				});
				this.css(this.CB['definition'], {
					width: pW + 'px',
				});
				this.buttonWidth['definition'] = this.CB['definition'].offsetWidth;
			} else {
				this.CB['definition'].innerHTML = '';
				this.CB['definitionP'].innerHTML = '';
				this.css([this.CB['definition'], this.CB['definitionLine']], 'display', 'none');
			}
		},
		/*
			�ڲ�����
			ע������������¼�
		*/
		addDefListener: function() {
			var thisTemp = this;
			var setTimeOutP = null;
			var defClick = function(event) {
				thisTemp.css(thisTemp.CB['definitionP'], {
					left: thisTemp.getCoor(thisTemp.CB['definition'])['x'] + 'px',
					display: 'block'
				});
			};
			this.addListener('click', defClick, this.CB['definition']);
			var defMouseOut = function(event) {
				if(setTimeOutP) {
					window.clearTimeout(setTimeOutP);
					setTimeOutP = null;
				}
				setTimeOutP = window.setTimeout(function(event) {
					thisTemp.css(thisTemp.CB['definitionP'], 'display', 'none');
				}, 500);
			};
			this.addListener('mouseout', defMouseOut, thisTemp.CB['definitionP']);
			var defMouseOver = function(event) {
				if(setTimeOutP) {
					window.clearTimeout(setTimeOutP);
					setTimeOutP = null;
				}
			};
			this.addListener('mouseover', defMouseOver, thisTemp.CB['definitionP']);
		},
		/*
			�ڲ�����
			�л������Ⱥ����Ķ���
		*/
		newDefinition: function(title) {
			var vArr = this.VA;
			var nVArr = [];
			var i = 0;
			for(i = 0; i < vArr.length; i++) {
				var v = vArr[i];
				if(v[2] == title) {
					nVArr.push(v);
				}
			}
			if(nVArr.length < 1) {
				return;
			}
			if(this.V != null && this.needSeek == 0) {
				this.needSeek = this.V.currentTime;
			}
			if(this.getFileExt(nVArr[0][0]) != '.m3u8') {
				this.isM3u8 = false;
			}
			if(!this.isM3u8) {
				if(nVArr.length == 1) {
					this.V.innerHTML = '';
					this.V.src = nVArr[0][0];
				} else {
					var source = '';
					nVArr = this.arrSort(nVArr);
					for(i = 0; i < nVArr.length; i++) {
						var type = '';
						var va = nVArr[i];
						if(va[1]) {
							type = ' type="' + va[1] + '"';
						}
						source += '<source src="' + va[0] + '"' + type + '>';
					}
					this.V.removeAttribute('src');
					this.V.innerHTML = source;
				}
			} else {
				this.embedHls(vArr[0][0], this.vars['autoplay']);
			}
			this.V.autoplay = 'autoplay';
			this.V.load();
			this.timerErrorFun();
			this.addListenerVideoChange();
		},
		/*
			���ú���
			����hls
		*/
		embedHls: function(url, autoplay) {
			var thisTemp = this;
			if(Hls.isSupported()) {
				var hls = new Hls();
				hls.loadSource(url);
				hls.attachMedia(this.V);
				hls.on(Hls.Events.MANIFEST_PARSED, function() {
					thisTemp.playerLoad();
					if(autoplay) {
						thisTemp.play();
					}
				});
			}
		},
		/*
			�ڲ�����
			������ʾ��
		*/
		prompt: function() {
			var thisTemp = this;
			var prompt = this.vars['prompt'];
			if(prompt == null || this.promptArr.length > 0) {
				return;
			}
			var showPrompt = function(event) {
				if(thisTemp.promptElement == null) {
					var random2 = 'prompte' + thisTemp.randomString(5);
					var ele2 = document.createElement('div');
					ele2.className = random2;
					thisTemp.PD.appendChild(ele2);
					thisTemp.promptElement = thisTemp.getByElement(random2);
					thisTemp.css(thisTemp.promptElement, {
						overflowX: 'hidden',
						lineHeight: '22px',
						fontSize: '14px',
						color: '#FFFFFF',
						position: 'absolute',
						display: 'block',
						zIndex: '90'
					});
				}
				var pcon = thisTemp.getPromptTest();
				var pW = pcon['pW'],
					pT = pcon['pT'],
					pL = parseInt(thisTemp.css(this, 'left')) - parseInt(pW * 0.5);
				if(pcon['pL'] > 10) {
					pL = pcon['pL'];
				}
				if(pL < 0) {
					pL = 0;
				}
				thisTemp.css(thisTemp.promptElement, {
					width: pW + 'px',
					left: (-pW - 10) + 'px',
					display: 'block'
				});
				thisTemp.promptElement.innerHTML = this.dataset.words;
				thisTemp.css(thisTemp.promptElement, {
					left: pL + 'px',
					top: (pT - thisTemp.promptElement.offsetHeight) + 'px'
				});
			};
			var hidePrompt = function(event) {
				if(thisTemp.promptElement != null) {
					thisTemp.css(thisTemp.promptElement, {
						display: 'none'
					});
				}
			};
			var i = 0;
			for(i = 0; i < prompt.length; i++) {
				var pr = prompt[i];
				var words = pr['words'];
				var time = pr['time'];
				var random = 'prompt' + this.randomString(5);
				var ele = document.createElement('div');
				ele.className = random;
				this.CB['timeBoBg'].appendChild(ele);
				var div = this.getByElement(random);
				div.setAttribute('data-time', time);
				div.setAttribute('data-words', words);
				this.css(div, {
					width: '6px',
					height: '6px',
					backgroundColor: '#FFFFFF',
					position: 'absolute',
					top: '4px',
					left: '-100px',
					display: 'none',
					zIndex: '1'
				});

				this.addListener('mouseover', showPrompt, div);
				this.addListener('mouseout', hidePrompt, div);
				this.promptArr.push(div);
			}
			this.changePrompt();
		},
		/*
			�ڲ�����
			������ʾ�ı���λ��
		*/
		getPromptTest: function() {
			var pW = this.previewWidth,
				pT = this.getCoor(this.CB['timeButton'])['y'],
				pL = 0;
			if(this.previewTop != null) {
				pT -= parseInt(this.css(this.previewTop, 'height'));
				pL = parseInt(this.css(this.previewTop, 'left'));
			} else {
				pT -= 35;
			}
			pL += 2;
			if(pL < 0) {
				pL = 0;
			}
			if(pL > this.PD.offsetWidth - pW) {
				pL = this.PD.offsetWidth - pW;
			}
			return { pW: pW, pT: pT, pL: pL };
		},
		/*
			�ڲ�����
			ɾ����ʾ��
		*/
		deletePrompt: function() {
			var arr = this.promptArr;
			if(arr.length > 0) {
				for(var i = 0; i < arr.length; i++) {
					if(arr[i]) {
						this.deleteChild(arr[i]);
					}
				}
			}
			this.promptArr = [];
		},
		/*
			�ڲ�����
			������ʾ������
		*/
		changePrompt: function() {
			if(this.promptArr.length == 0) {
				return;
			}
			var arr = this.promptArr;
			var duration = this.getMetaDate()['duration'];
			var bw = this.CB['timeBoBg'].offsetWidth;
			for(var i = 0; i < arr.length; i++) {
				var time = parseInt(arr[i].dataset.time);
				var left = parseInt(time * bw / duration) - parseInt(arr[i].offsetWidth * 0.5);
				if(left < 0) {
					left = 0;
				}
				if(left > bw - parseInt(arr[i].offsetWidth * 0.5)) {
					left = bw - parseInt(arr[i].offsetWidth * 0.5);
				}
				this.css(arr[i], {
					left: left + 'px',
					display: 'block'
				});
			}
		},
		/*
			�ڲ�����
			����Ԥ��ͼƬЧ��
		*/
		preview: function(obj) {
			var thisTemp = this;
			var preview = {
				src: null,
				scale: 0
			};
			preview = this.standardization(preview, this.vars['preview']);
			if(preview['src'] == null || preview['scale'] <= 0) {
				return;
			}
			var srcArr = preview['src'];
			if(this.previewStart == 0) { //�����û�й��������Ƚ��й���
				this.previewStart = 1;
				if(srcArr.length > 0) {
					var i = 0;
					var imgW = 0,
						imgH = 0;
					var random = thisTemp.randomString(10);
					var loadNum = 0;
					var loadImg = function(i) {
						srcArr[i] = thisTemp.getNewUrl(srcArr[i]);
						var n = 0;
						var img = new Image();
						img.src = srcArr[i];
						img.className = random + i;
						img.onload = function(event) {
							loadNum++;
							if(thisTemp.previewDiv == null) { //���û�н���DIV����
								imgW = img.width;
								imgH = img.height;
								thisTemp.previewWidth = parseInt(imgW * 0.1);
								var ele = document.createElement('div');
								ele.className = random;
								thisTemp.PD.appendChild(ele);
								thisTemp.previewDiv = thisTemp.getByElement(random);
								var eleTop = (obj['y'] - parseInt(imgH * 0.1) + 2);
								thisTemp.css(thisTemp.previewDiv, {
									width: srcArr.length * imgW * 10 + 'px',
									height: parseInt(imgH * 0.1) + 'px',
									backgroundColor: '#000000',
									position: 'absolute',
									left: '0px',
									top: eleTop + 'px',
									display: 'none',
									zIndex: '80'
								});
								ele.setAttribute('data-x', '0');
								ele.setAttribute('data-y', eleTop);
								var ele2 = document.createElement('div');
								ele2.className = random + 'd2';
								thisTemp.PD.appendChild(ele2);
								thisTemp.previewTop = thisTemp.getByElement(ele2.className);
								thisTemp.css(thisTemp.previewTop, {
									width: parseInt(imgW * 0.1) + 'px',
									height: parseInt(imgH * 0.1) + 'px',
									position: 'absolute',
									border: '5px solid ' + thisTemp.css(thisTemp.CB['timeProgress'], 'backgroundColor'),
									left: '0px',
									top: (obj['y'] - parseInt(imgH * 0.1) + 2) + 'px',
									display: 'none',
									zIndex: '81'
								});
								var html = '';
								for(n = 0; n < srcArr.length; n++) {
									html += thisTemp.newCanvas(random + n, imgW * 10, parseInt(imgH * 0.1))
								}
								thisTemp.previewDiv.innerHTML = html;
							}
							thisTemp.previewDiv.appendChild(img);
							var cimg = thisTemp.getByElement(img.className);
							var canvas = thisTemp.getByElement(img.className + '-canvas');
							var context = canvas.getContext('2d');
							var sx = 0,
								sy = 0,
								x = 0,
								h = parseInt(imgH * 0.1);
							for(n = 0; n < 100; n++) {
								x = parseInt(n * imgW * 0.1);
								context.drawImage(cimg, sx, sy, parseInt(imgW * 0.1), h, x, 0, parseInt(imgW * 0.1), h);
								sx += parseInt(imgW * 0.1);
								if(sx >= imgW) {
									sx = 0;
									sy += h;
								}
								thisTemp.css(cimg, 'display', 'none');
							}
							if(loadNum == srcArr.length) {
								thisTemp.previewStart = 2;
							} else {
								i++;
								loadImg(i);
							}
						};
					};
				}
				loadImg(i);
				return;
			}
			if(this.previewStart == 2) {
				var isTween = true;
				var nowNum = parseInt(obj['time'] / this.vars['preview']['scale']);
				var numTotal = parseInt(thisTemp.getMetaDate()['duration'] / this.vars['preview']['scale']);
				if(thisTemp.css(thisTemp.previewDiv, 'display') == 'none') {
					isTween = false;
				}
				thisTemp.css(thisTemp.previewDiv, 'display', 'block');
				var imgWidth = thisTemp.previewDiv.offsetWidth * 0.01 / srcArr.length;
				var left = (imgWidth * nowNum) - obj['x'] + parseInt(imgWidth * 0.5),
					top = obj['y'] - thisTemp.previewDiv.offsetHeight;
				thisTemp.css(thisTemp.previewDiv, 'top', top + 2 + 'px');
				var topLeft = obj['x'] - parseInt(imgWidth * 0.5);
				var timepieces = 0;
				if(topLeft < 0) {
					topLeft = 0;
					timepieces = obj['x'] - topLeft - imgWidth * 0.5;
				}
				if(topLeft > thisTemp.PD.offsetWidth - imgWidth) {
					topLeft = thisTemp.PD.offsetWidth - imgWidth;
					timepieces = obj['x'] - topLeft - imgWidth * 0.5;
				}
				if(left < 0) {
					left = 0;
				}
				if(left > numTotal * imgWidth - thisTemp.PD.offsetWidth) {
					left = numTotal * imgWidth - thisTemp.PD.offsetWidth;
				}
				thisTemp.css(thisTemp.previewTop, {
					left: topLeft + 'px',
					top: top + 2 + 'px',
					display: 'block'
				});
				if(thisTemp.previewTop.offsetHeight>thisTemp.previewDiv.offsetHeight){
					thisTemp.css(thisTemp.previewTop, {
						height:thisTemp.previewDiv.offsetHeight-(thisTemp.previewTop.offsetHeight-thisTemp.previewDiv.offsetHeight)+'px'
					});
				}
				if(this.previewTween != null) {
					this.animatePause(this.previewTween);
					this.previewTween = null
				}
				var nowLeft = parseInt(thisTemp.css(thisTemp.previewDiv, 'left'));
				var leftC = nowLeft + left;
				if(nowLeft == -(left + timepieces)) {
					return;
				}
				if(isTween) {
					var obj = {
						element: thisTemp.previewDiv,
						start: null,
						end: -(left + timepieces),
						speed: 0.3
					};
					this.previewTween = this.animate(obj);
				} else {
					thisTemp.css(thisTemp.previewDiv, 'left', -(left + timepieces) + 'px')
				}
			}
		},
		/*
			�ڲ�����
			ɾ��Ԥ��ͼ�ڵ�
		*/
		deletePreview: function() {
			if(this.previewDiv != null) {
				this.deleteChild(this.previewDiv);
				this.previewDiv = null;
				this.previewStart = 0;
			}
		},
		/*
			�ڲ�����
			�޸���Ƶ��ַ������
		*/
		changeVideo: function() {
			if(!this.html5Video) {
				this.getVarsObject();
				this.V.newVideo(this.vars);
				return;
			}
			var vArr = this.VA;
			var v = this.vars;
			var i = 0;
			if(vArr.length < 1) {
				return;
			}
			if(this.V != null && this.needSeek == 0) {
				this.needSeek = this.V.currentTime;
			}
			if(v['poster']) {
				this.V.poster = v['poster'];
			} else {
				this.V.removeAttribute('poster');
			}
			if(v['loop']) {
				this.V.loop = 'loop';
			} else {
				this.V.removeAttribute('loop');
			}
			if(v['seek'] > 0) {
				this.needSeek = v['seek'];
			} else {
				this.needSeek = 0;
			}
			if(this.getFileExt(vArr[0][0]) != '.m3u8') {
				this.isM3u8 = false;
			}
			if(!this.isM3u8) {
				if(vArr.length == 1) {
					this.V.innerHTML = '';
					this.V.src = vArr[0][0];
				} else {
					var source = '';
					vArr = this.arrSort(vArr);
					for(i = 0; i < vArr.length; i++) {
						var type = '';
						var va = vArr[i];
						if(va[1]) {
							type = ' type="' + va[1] + '"';
						}
						source += '<source src="' + va[0] + '"' + type + '>';
					}
					this.V.removeAttribute('src');
					this.V.innerHTML = source;
				}
				//������Ƶ��ַ����
				if(v['autoplay']) {
					this.V.autoplay = 'autoplay';
				} else {
					this.V.removeAttribute('autoplay');
				}
				this.V.load();
			} else {
				this.embedHls(vArr[0][0], v['autoplay']);
			}
			if(!this.isUndefined(v['volume'])) {
				this.changeVolume(v['volume']);
			}
			this.resetPlayer(); //���ý���Ԫ��
			this.timerErrorFun();
			this.addListenerVideoChange();
			//���������Ļ�����
			if(this.vars['chtrack']) {
				this.loadTrack();
			}
		},
		/*
			�ڲ�����
			�����м���ͣ��ť,����loading��������ʾ�ı����λ��
		*/
		elementCoordinate: function() {
			this.pdCoor = this.getXY(this.PD);
			this.css(this.CB['pauseCenter'], {
				left: parseInt((this.PD.offsetWidth - 80) * 0.5) + 'px',
				top: parseInt((this.PD.offsetHeight - 80) * 0.5) + 'px'
			});
			this.css(this.CB['loading'], {
				left: parseInt((this.PD.offsetWidth - 60) * 0.5) + 'px',
				top: parseInt((this.PD.offsetHeight - 60) * 0.5) + 'px'
			});
			this.css(this.CB['errorText'], {
				left: parseInt((this.PD.offsetWidth - 120) * 0.5) + 'px',
				top: parseInt((this.PD.offsetHeight - 30) * 0.5) + 'px'
			});
			this.css(this.CB['logo'], {
				left: parseInt(this.PD.offsetWidth - this.CB['logo'].offsetWidth - 20) + 'px',
				top: '20px'
			});
			this.checkBarWidth();
		},
		/*
			�ڲ�����
			���������ߴ�仯ʱ����ʾ��������ؽڵ�
		*/
		checkBarWidth: function() {
			var controlBarW = this.CB['controlBar'].offsetWidth;
			var ele = [];
			ele.push([
				[this.CB['full'], this.CB['escFull'], this.CB['fullLine']], this.buttonWidth['full'] + 2, 'full'
			]);
			if(this.vars['front'] != '') {
				ele.push([
					[this.CB['front'], this.CB['frontLine']], this.buttonWidth['front'] + 2
				]);
			}
			if(this.vars['next'] != '') {
				ele.push([
					[this.CB['next'], this.CB['nextLine']], this.buttonWidth['next'] + 2
				]);
			}
			if(this.CB['definition'].innerHTML != '') {
				ele.push([
					[this.CB['definition'], this.CB['definitionLine']], this.buttonWidth['definition'] + 2
				]);
			}
			ele.push([
				[this.CB['volume']], this.buttonWidth['volume']
			]);
			ele.push([
				[this.CB['mute'], this.CB['escMute'], this.CB['muteLine']], this.buttonWidth['mute'] + 2, 'mute'
			]);
			ele.push([
				[this.CB['timeText']], this.buttonWidth['timeText']
			]);
			ele.push([
				[this.CB['play'], this.CB['pause'], this.CB['playLine']], this.buttonWidth['play'] + 2, 'play'
			]);

			var i = 0;
			var len = 0;
			var isc = true;
			//��������Ҫ��ʾ�Ľڵ���ܿ��
			for(var i = 0; i < ele.length; i++) {
				var nlen = ele[i][1];
				if(nlen > 2) {
					len += nlen;
				} else {
					isc = false;
				}
			}
			if(isc) {
				this.buttonLen = len;
				this.buttonArr = ele;
			}
			len = this.buttonLen;
			ele = this.buttonArr;
			for(var i = 0; i < ele.length; i++) {
				if(len > controlBarW) {
					len -= ele[i][1];
					this.css(ele[i][0], 'display', 'none');
				} else {
					this.css(ele[i][0], 'display', 'block');
					if(ele[i].length == 3) {
						var name = ele[i][2];
						switch(name) {
							case 'mute':
								if(this.volume == 0) {
									this.css(this.CB['mute'], 'display', 'none');
								} else {
									this.css(this.CB['escMute'], 'display', 'none');
								}
								break;
							case 'play':
								this.playShow(this.V.paused ? false : true);
								break;
							case 'full':
								if(this.full) {
									this.css(this.CB['full'], 'display', 'none');
								} else {
									this.css(this.CB['escFull'], 'display', 'none');
								}
								break;
						}
					}
				}
			}
		},
		/*
			�ڲ�����
			��ʼ����ͣ�򲥷Ű�ť
		*/
		initPlayPause: function() {
			if(this.vars['autoplay']) {
				this.css([this.CB['play'], this.CB['pauseCenter']], 'display', 'none');
				this.css(this.CB['pause'], 'display', 'block');
			} else {
				this.css(this.CB['play'], 'display', 'block');
				if(this.css(this.CB['errorText'], 'display') == 'none') {
					this.css(this.CB['pauseCenter'], 'display', 'block');
				}
				this.css(this.CB['pause'], 'display', 'none');
			}
		},
		/*
			������ĸ�����������ģ�����Ƶ�ļ����¼������������ȫ��״̬�¼�
			�ڲ�����
			������������¼�����
		*/
		addListenerError: function() {
			for(var i = 0; i < this.errorFunArr.length; i++) {
				var fun = this.errorFunArr[i];
				if(typeof(fun) == 'string') {
					fun = fun.replace('()', '');
					eval(fun + '()');
				} else {
					fun();
				}
			}
		},
		/*
			�ڲ�����
			ɾ����������¼�����
		*/
		delErrorFunArr: function(f) {
			try {
				var index = this.errorFunArr.indexOf(f);
				if(index > -1) {
					this.errorFunArr.splice(index, 1);
				}
			} catch(e) {}
		},
		/*
			�ڲ�����
			�����Ƿ�ȫ��״̬�ı�ʱҪ���õļ����¼�����
		*/
		addListenerFull: function() {
			for(var i = 0; i < this.fullFunArr.length; i++) {
				var fun = this.fullFunArr[i];
				if(typeof(fun) == 'string') {
					fun = fun.replace('()', '');
					eval(fun + '()');
				} else {
					fun();
				}
			}
		},
		/*
			�ڲ�����
			ɾ���Ƿ�ȫ��״̬�¼�����
		*/
		delFullFunArr: function(f) {
			try {
				var index = this.fullFunArr.indexOf(f);
				if(index > -1) {
					this.fullFunArr.splice(index, 1);
				}
			} catch(e) {}
		},
		/*
			�ڲ�����
			�������ŵ�ַ�ı�ʱҪ���õļ����¼�����
		*/
		addListenerVideoChange: function() {
			for(var i = 0; i < this.videoChangeFunArr.length; i++) {
				var fun = this.videoChangeFunArr[i];
				if(typeof(fun) == 'string') {
					fun = fun.replace('()', '');
					eval(fun + '()');
				} else {
					fun();
				}
			}
		},
		/*
			�ڲ�����
			ɾ�����ŵ�ַ�ı�ʱ״̬�¼�����
		*/
		delVideoChangeFunArr: function(f) {
			try {
				var index = this.videoChangeFunArr.indexOf(f);
				if(index > -1) {
					this.videoChangeFunArr.splice(index, 1);
				}
			} catch(e) {}
		},
		/*
			����Ϊ�����¼�
			�ڲ�����
			����Ԫ�����Ѽ���
		*/
		loadedHandler: function() {
			this.loaded = true;
			if(this.playerType != 'html5video') {
				this.V.changeLanguage(this.language);
				if(this.contextMenu.length > 0) {
					this.V.newMenu(this.contextMenu);
				}
				if(this.config) {
					this.V.config(this.config);
				}
			}
			if(this.vars['loaded'] != '') {
				try {
					eval(this.vars['loaded'] + '()');
				} catch(event) {

				}
				this.addListenerVideoChange();
			}
		},
		/*
			�ڲ�����
			��������
		*/
		playingHandler: function() {
			this.playShow(true);
			if(this.needSeek > 0) {
				this.seek(this.needSeek);
				this.needSeek = 0;
			}
			if(this.animatePauseArray.length > 0) {
				this.animateResume('pause');
			}
			if(this.playerType == 'html5video' && this.V != null && this.config['videoDrawImage']) {
				this.sendVCanvas();
			}
		},
		/*
			�ڲ�����
			ʹ�û���������Ƶ
		*/
		sendVCanvas: function() {
			if(this.timerVCanvas == null) {
				this.css(this.V, 'display', 'none');
				this.css(this.MD, 'display', 'block');
				var thisTemp = this;
				var videoCanvas = function() {
					if(thisTemp.MDCX.width != thisTemp.PD.offsetWidth) {
						thisTemp.MDC.width = thisTemp.PD.offsetWidth;
					}
					if(thisTemp.MDCX.height != thisTemp.PD.offsetHeight) {
						thisTemp.MDC.height = thisTemp.PD.offsetHeight;
					}
					thisTemp.MDCX.clearRect(0, 0, thisTemp.MDCX.width, thisTemp.MDCX.height);
					var coor = thisTemp.getProportionCoor(thisTemp.PD.offsetWidth, thisTemp.PD.offsetHeight, thisTemp.V.videoWidth, thisTemp.V.videoHeight);
					thisTemp.MDCX.drawImage(thisTemp.V, 0, 0, thisTemp.V.videoWidth, thisTemp.V.videoHeight, coor['x'], coor['y'], coor['width'], coor['height']);
				};
				this.timerVCanvas = new this.timer(0, videoCanvas);
			}
		},
		/*
			�ڲ�����
			������ͣ
		*/
		pauseHandler: function() {
			this.playShow(false);
			if(this.animatePauseArray.length > 0) {
				this.animatePause('pause');
			}
			if(this.playerType == 'html5video' && this.V != null && this.config['videoDrawImage']) {
				this.stopVCanvas();
			}
		},
		/*
			�ڲ�����
			ֹͣ����
		*/
		stopVCanvas: function() {
			if(this.timerVCanvas != null) {
				this.css(this.V, 'display', 'block');
				this.css(this.MD, 'display', 'none');
				if(this.timerVCanvas.runing) {
					this.timerVCanvas.stop();
				}
				this.timerVCanvas = null;
			}
		},
		/*
			�ڲ�����
			���ݵ�ǰ���Ż�����ͣȷ��ͼ����ʾ
		*/
		playShow: function(b) {
			if(b) {
				this.css(this.CB['play'], 'display', 'none');
				this.css(this.CB['pauseCenter'], 'display', 'none');
				this.css(this.CB['pause'], 'display', 'block');
			} else {
				this.css(this.CB['play'], 'display', 'block');
				if(this.css(this.CB['errorText'], 'display') == 'none') {
					this.css(this.CB['pauseCenter'], 'display', 'block');
				} else {
					this.css(this.CB['pauseCenter'], 'display', 'none');
				}
				this.css(this.CB['pause'], 'display', 'none');
			}
		},
		/*
			�ڲ�����
			����seek����
		*/
		seekedHandler: function() {
			this.resetTrack();
			this.isTimeButtonMove = true;
			if(this.V.paused) {
				this.play();
			}
		},
		/*
			�ڲ�����
			�������Ž���
		*/
		endedHandler: function() {
			if(!this.vars['loop']) {
				this.pause();
			}
		},
		/*
			�ڲ�����
			���������ı�
		*/
		volumechangeHandler: function() {
			try {
				if(this.V.volume > 0) {
					this.css(this.CB['mute'], 'display', 'block');
					this.css(this.CB['escMute'], 'display', 'none');
				} else {
					this.css(this.CB['mute'], 'display', 'none');
					this.css(this.CB['escMute'], 'display', 'block');
				}
			} catch(event) {}
		},

		/*
			�ڲ�����
			��������ʱ����ڽ�����
		*/
		timeUpdateHandler: function() {
			var duration = 0;
			if(this.playerType == 'html5video') {
				try {
					duration = this.V.duration;
				} catch(event) {}
			}
			if(duration > 0) {
				this.time = this.V.currentTime;
				this.timeTextHandler();
				this.trackShowHandler();
				if(this.isTimeButtonMove) {
					this.timeProgress(this.time, duration);
				}
			}
		},
		/*
			�ڲ�����
			��ʱ��ı������
		*/
		timeProgress: function(time, duration) {
			var timeProgressBgW = this.CB['timeProgressBg'].offsetWidth;
			var timeBOW = parseInt((time * timeProgressBgW / duration) - (this.CB['timeButton'].offsetWidth * 0.5));
			if(timeBOW > timeProgressBgW - this.CB['timeButton'].offsetWidth) {
				timeBOW = timeProgressBgW - this.CB['timeButton'].offsetWidth;
			}
			if(timeBOW < 0) {
				timeBOW = 0;
			}
			this.css(this.CB['timeProgress'], 'width', timeBOW + 'px');
			this.css(this.CB['timeButton'], 'left', parseInt(timeBOW) + 'px');
		},
		/*
			�ڲ�����
			��������ʱ��ı�ʱ����ʾ�ı���
		*/
		timeTextHandler: function() { //��ʾʱ��/��ʱ��
			var duration = this.V.duration;
			var time = this.V.currentTime;
			if(isNaN(duration)) {
				duration = 0;
			}
			this.CB['timeText'].innerHTML = this.formatTime(time) + ' / ' + this.formatTime(duration);
			if(this.CB['timeText'].offsetWidth > 0) {
				this.buttonWidth['timeText'] = this.CB['timeText'].offsetWidth;
			}
		},
		/*
			�ڲ�����
			�����Ƿ��ǻ���״̬
		*/
		bufferEdHandler: function() {
			var thisTemp = this;
			var clearTimerBuffer = function() {
				if(thisTemp.timerBuffer != null) {
					if(thisTemp.timerBuffer.runing) {
						thisTemp.timerBuffer.stop();
					}
					thisTemp.timerBuffer = null;
				}
			};
			clearTimerBuffer();
			var bufferFun = function() {
				if(thisTemp.V.buffered.length > 0) {
					var duration = thisTemp.V.duration;
					var len = thisTemp.V.buffered.length;
					var bufferStart = thisTemp.V.buffered.start(len - 1);
					var bufferEnd = thisTemp.V.buffered.end(len - 1);
					var loadTime = bufferStart + bufferEnd;
					var loadProgressBgW = thisTemp.CB['timeProgressBg'].offsetWidth;
					var timeButtonW = thisTemp.CB['timeButton'].offsetWidth;
					var loadW = parseInt((loadTime * loadProgressBgW / duration) + timeButtonW);
					if(loadW >= loadProgressBgW) {
						loadW = loadProgressBgW;
						clearTimerBuffer();
					}
					thisTemp.changeLoad(loadTime);
				}
			};
			this.timerBuffer = new this.timer(200, bufferFun);
			//this.timerBuffer.start();
		},
		/*
			�ڲ�����
			����������ؽ���
		*/
		changeLoad: function(loadTime) {
			if(this.V == null) {
				return;
			}
			var loadProgressBgW = this.CB['timeProgressBg'].offsetWidth;
			var timeButtonW = this.CB['timeButton'].offsetWidth;
			var duration = this.V.duration;
			if(this.isUndefined(loadTime)) {
				loadTime = this.loadTime;
			} else {
				this.loadTime = loadTime;
			}
			var loadW = parseInt((loadTime * loadProgressBgW / duration) + timeButtonW);
			this.css(this.CB['loadProgress'], 'width', loadW + 'px');
		},
		/*
			�ڲ�����
			�ж��Ƿ���ֱ��
		*/
		judgeIsLive: function() {
			var thisTemp = this;
			if(this.timerError != null) {
				if(this.timerError.runing) {
					this.timerError.stop();
				}
				this.timerError = null;
			}
			this.error = false;
			this.css(this.CB['errorText'], 'display', 'none');
			var timeupdate = function(event) {
				thisTemp.timeUpdateHandler();
			};
			if(!this.vars['live']) {
				if(this.V != null && this.playerType == 'html5video') {
					this.addListener('timeupdate', timeupdate);
					thisTemp.timeTextHandler();
					thisTemp.prompt(); //�����ʾ��
					window.setTimeout(function() {
						thisTemp.bufferEdHandler();
					}, 200);
				}
			} else {
				this.removeListener('timeupdate', timeupdate);
				if(this.timerTime != null) {
					window.clearInterval(this.timerTime);
					timerTime = null;
				}
				if(this.timerTime != null) {
					if(this.timerTime.runing) {
						this.timerTime.stop();
					}
					this.timerTime = null;
				}
				var timeFun = function() {
					if(thisTemp.V != null && !thisTemp.V.paused) {
						thisTemp.CB['timeText'].innerHTML = thisTemp.getNowDate();
					}
				};
				this.timerTime = new this.timer(1000, timeFun);
				//timerTime.start();
			}
			this.definition();
		},
		/*
			�ڲ�����
			������Ļ
		*/
		loadTrack: function() {
			var thisTemp = this;
			var track = this.vars['chtrack'];
			var obj = {
				method: 'get',
				dataType: 'text',
				url: track['src'],
				charset: track['charset'],
				success: function(data) {
					thisTemp.track = thisTemp.parseSrtSubtitles(data);
					thisTemp.trackIndex = 0;
					thisTemp.nowTrackShow = { sn: '' };
				}
			};
			this.ajax(obj);
		},
		/*
			�ڲ�����
			������Ļ
		*/
		resetTrack: function() {
			this.trackIndex = 0;
			this.nowTrackShow = { sn: '' };
		},
		/*
			�ڲ�����
			����ʱ��ı��ȡ��ʾ��Ļ
		*/
		trackShowHandler: function() {
			if(this.track.length < 1) {
				return;
			}
			if(this.trackIndex >= this.track.length) {
				this.trackIndex = 0;
			}
			var nowTrack = this.track[this.trackIndex]; //��ǰ��Ŷ�Ӧ����Ļ����
			/*
				this.nowTrackShow=��ǰ��ʾ�ڽ����ϵ�����
				�����ǰʱ��������nowTrackʱ���ڣ�����Ҫ�ж�
			*/
			if(this.time >= nowTrack['startTime'] && this.time <= nowTrack['endTime']) {
				/*
				 	�����ǰ��ʾ�����ݲ����ڵ�ǰ��Ҫ��ʾ������ʱ������Ҫ��ʾ��ȷ������
				*/
				var nowShow = this.nowTrackShow;
				if(nowShow['sn'] != nowTrack['sn']) {
					this.trackHide();
					this.trackShow(nowTrack);
				}
			} else {
				/*
				 * �����ǰ����ʱ�䲻�ڵ�ǰ�����Ļ�ڣ�����Ҫ����յ�ǰ����Ļ���ݣ�����ʾ�µ���Ļ����
				 */
				this.trackHide();
				this.checkTrack();
			}
		},
		/*
			�ڲ�����
			��ʾ��Ļ����
		*/
		trackShow: function(track) {
			this.nowTrackShow = track;
			var arr = track['content'];
			for(var i = 0; i < arr.length; i++) {
				var obj = {
					list: [{
						type: 'text',
						text: arr[i],
						fontColor: '#FFFFFF',
						fontSize: 16,
						fontFamily: '"Microsoft YaHei", YaHei, "΢���ź�", SimHei,"\5FAE\8F6F\96C5\9ED1", "����",Arial',
						lineHeight: 30,
					}],
					position: [1, 2, null, -(arr.length - i) * 30 - 50]
				};
				var ele = this.addElement(obj);
				this.trackElement.push(ele);
			}
		},
		/*
			�ڲ�����
			��������Ļ����
		*/
		trackHide: function() {
			for(var i = 0; i < this.trackElement.length; i++) {
				this.deleteElement(this.trackElement[i]);
			}
			this.trackElement = [];
		},
		/*
			�ڲ�����
			���¼�����Ļ�ı��
		*/
		checkTrack: function() {
			var num = this.trackIndex;
			var arr = this.track;
			var i = 0;
			for(i = num; i < arr.length; i++) {
				if(this.time >= arr[i]['startTime'] && this.time <= arr[i]['endTime']) {
					this.trackIndex = i;
					break;
				}
			}
		},
		/*
		-----------------------------------------------------------------------------�ӿں�����ʼ
			�ӿں���
			�ڲ��ź���֮ͣ���л�
		*/
		playOrPause: function() {
			if(this.config['videoClick']) {
				if(this.V == null) {
					return;
				}
				if(this.playerType=='flashplayer'){
					this.V.playOrPause();
					return;
				}
				if(this.V.paused) {
					this.play();
				} else {
					this.pause();
				}
			}
		},
		/*
			�ӿں���
			���Ŷ���
		*/
		play: function() {
			if(this.V != null && !this.error && this.loaded) {
				if(this.playerType=='html5video'){
					this.V.play();
				}
				else{
					this.V.videoPlay();
				}
			}
		},
		/*
			�ӿں���
			��ͣ����
		*/
		pause: function() {
			if(this.V != null && !this.error && this.loaded) {
				if(this.playerType=='html5video'){
					this.V.pause();
				}
				else{
					this.V.videoPause();
				}
			}
		},
		/*
			�ӿں���
			��תʱ�䶯��
		*/
		seek: function(time) {
			if(!this.loaded) {
				return;
			}
			var meta = this.getMetaDate();
			var duration = meta['duration'];
			if(duration > 0 && time > duration) {
				time = duration;
			}
			if(this.html5Video && this.playerType == 'html5video' && !this.error) {
				this.V.currentTime = time;
			} else {
				this.V.seek(time);
			}
		},
		/*
			�ӿں���
			��������/��ȡ����
		*/
		changeVolume: function(vol, bg, button) {
			if(isNaN(vol) || this.isUndefined(vol)) {
				vol = 0;
			}
			if(!this.loaded) {
				this.vars['volume'] = vol;
			}
			if(!this.html5Video) {
				this.V.changeVolume(vol);
				return;
			}
			try {
				if(this.isUndefined(bg)) {
					bg = true;
				}
			} catch(e) {}
			try {
				if(this.isUndefined(button)) {
					button = true;
				}
			} catch(e) {}
			if(vol<0){
				vol=0;
			}
			if(vol>1){
				vol=1;
			}
			this.V.volume = vol;
			this.volume = vol;
			if(bg) {
				var bgW = vol * this.CB['volumeBg'].offsetWidth;
				if(bgW < 0) {
					bgW = 0;
				}
				if(bgW > this.CB['volumeBg'].offsetWidth) {
					bgW = this.CB['volumeBg'].offsetWidth;
				}
				this.css(this.CB['volumeUp'], 'width', bgW + 'px');
			}

			if(button) {
				var buLeft = parseInt(this.CB['volumeUp'].offsetWidth - (this.CB['volumeBO'].offsetWidth * 0.5));
				if(buLeft > this.CB['volumeBg'].offsetWidth - this.CB['volumeBO'].offsetWidth) {
					buLeft = this.CB['volumeBg'].offsetWidth - this.CB['volumeBO'].offsetWidth
				}
				if(buLeft < 0) {
					buLeft = 0;
				}
				this.css(this.CB['volumeBO'], 'left', buLeft + 'px');
			}
		},
		/*
			���ú���
			ȫ��/�˳�ȫ���������ö���ֻ�����û������ſ��Դ����������û������ť�������¼�
		*/
		switchFull: function() {
			if(this.full) {
				this.quitFullScreen();
			} else {
				this.fullScreen();
			}
		},
		/*
			���ú���
			ȫ���������ö���ֻ�����û������ſ��Դ����������û������ť�������¼�
		*/
		fullScreen: function() {
			if(this.html5Video && this.playerType == 'html5video') {
				var element = this.PD;
				if(element.requestFullscreen) {
					element.requestFullscreen();
				} else if(element.mozRequestFullScreen) {
					element.mozRequestFullScreen();
				} else if(element.webkitRequestFullscreen) {
					element.webkitRequestFullscreen();
				} else if(element.msRequestFullscreen) {
					element.msRequestFullscreen();
				}
				this.judgeFullScreen();
			}
		},
		/*
			���ú���
			�˳�ȫ������
		*/
		quitFullScreen: function() {
			if(this.html5Video && this.playerType == 'html5video') {
				if(document.exitFullscreen) {
					document.exitFullscreen();
				} else if(document.msExitFullscreen) {
					document.msExitFullscreen();
				} else if(document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if(document.oRequestFullscreen) {
					document.oCancelFullScreen();
				} else if(document.requestFullscreen) {
					document.requestFullscreen();
				} else if(document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				} else {
					this.css(document.documentElement, 'cssText', '');
					this.css(document.document.body, 'cssText', '');
					this.css(this.PD, 'cssText', '');
				}
				this.judgeFullScreen();
			}
		},
		/*
			�ӿں���
			�ı䲥�����ߴ�
		*/
		changeSize: function(w, h) {
			if(this.isUndefined(w)) {
				w = 0;
			}
			if(this.isUndefined(h)) {
				h = 0;
			}
			if(w > 0) {
				this.css(this.CD, 'width', w + 'px');
			}
			if(h > 0) {
				this.css(this.CD, 'height', h + 'px');
			}
			if(this.html5Video) {
				this.elementCoordinate();
			}
		},
		/*
			�ӿں���
			�򲥷��������µ���Ƶ��ַ
		*/
		newVideo: function(c) {
			this.embed(c);
		},
		/*
			-----------------------------------------------------------------------
			����flashplayer
		*/
		embedSWF: function() {
			var vid = this.randomString();
			var flashvars = this.getFlashVars();
			var param = this.getFlashplayerParam();
			var flashplayerUrl = 'http://www.macromedia.com/go/getflashplayer';
			var html = '',
				src = javascriptPath + 'chplayer.swf';
			id = 'id="' + vid + '" name="' + vid + '" ';
			html += '<object pluginspage="' + flashplayerUrl + '" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"  codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=11,3,0,0" width="100%" height="100%" ' + id + ' align="middle">';
			html += param['v'];
			html += '<param name="movie" value="' + src + '">';
			html += '<param name="flashvars" value="' + flashvars + '">';
			html += '<embed ' + param['w'] + ' src="' + src + '" flashvars="' + flashvars + '" width="100%" height="100%" ' + id + ' align="middle" type="application/x-shockwave-flash" pluginspage="' + flashplayerUrl + '" />';
			html += '</object>';
			this.PD.innerHTML = html;
			this.V = this.getObjectById(vid); //V�����岥��������ȫ�ֱ���
			this.playerType = 'flashplayer';
		},
		/*
			���ú���
			��vars����ת�����ַ�
		*/
		getFlashVars: function() {
			this.getVarsObject();
			var v = this.vars;
			var z = '';
			for(k in v) {
				if(k != 'flashplayer' && k != 'container' && v[k] != '') {
					if(z != '') {
						z += '&';
					}
					var vk = v[k];
					if(vk == true) {
						vk = 1;
					}
					if(vk == false) {
						vk = 0;
					}
					z += k + '=' + vk;
				}

			}
			return z;
		},
		/*
			���ú���
			��vars��ʽ����flash�ܽ��ܵĶ�������getFlashVars����ת�����ַ�������newVideoֱ��ʹ��
		*/
		getVarsObject: function() {
			var v = this.vars;
			var f = '',
				d = '',
				w = ''; //f=��Ƶ��ַ��d=�����ȵ�ַ,w=Ȩ�أ�z=���յ�ַ
			var arr = this.VA;
			var prompt = v['prompt'];
			var i = 0;
			for(i = 0; i < arr.length; i++) {
				var arr2 = arr[i];
				if(arr2){
					if(f != '') {
						f += '|';
						d += '|';
						w += '|';
					}
					f += arr2[0].replace(/&/g, '%26');
					d += arr2[2];
					w += arr2[3];
				}
			}
			if(v['preview'] != null) {
				v['previewscale'] = v['preview']['scale'];
				v['preview'] = v['preview']['src'].join('|');

			}
			if(prompt != null) {
				v['prompt'] = '';
				v['prompttime'] = '';
				for(i = 0; i < prompt.length; i++) {
					if(v['prompt'] != '') {
						v['prompt'] += '|';
						v['prompttime'] += '|';
					}
					v['prompt'] += prompt[i]['words'];
					v['prompttime'] += prompt[i]['time'];
				}

			}
			v['video'] = f;
			v['definition'] = d;
			v['weight'] = w;
			v['logo'] = this.logo;
			var newV={};
			for(var k in v){
				if(v[k]!=null){
					newV[k]=v[k];
				}
			}
			this.vars = newV;
		},
		/*
			���ú���
			��embedSWF���param�Ķ������ת��
		*/
		getFlashplayerParam: function() {
			var w = '',
				v = '',
				o = {
					allowScriptAccess: 'sameDomain',
					allowFullScreen: true,
					quality: 'high',
					bgcolor: '#000'
				};
			for(var e in o) {
				w += e + '="' + o[e] + '" ';
				v += '<param name="' + e + '" value="' + o[e] + '" />';
			}
			w = w.replace('movie=', 'src=');
			return {
				w: w,
				v: v
			};
		},
		/*
			���ú���
			flashplayer����д��timeֵ
		*/
		sendTime: function(time) {
			this.time = time;
			this.trackShowHandler();
		},
		/*
			���ú���
			flashplayer����д��volumeֵ
		*/
		sendVolume: function(vol) {
			this.volume = vol;
		},
		/*
			���ú���
			flashplayer����д��fullֵ
		*/
		sendFull: function(b) {
			this.full = b;
		},
		/*
			������������
			-----------------------------------------------------------------------

			�ӿں���
			��ȡԪ���ݲ���
		*/
		getMetaDate: function() {
			if(!this.loaded || this.V==null) {
				return false;
			}
			if(this.playerType == 'html5video') {
				var duration=0;
				try{
					duration=!isNaN(this.V.duration) ? this.V.duration : 0;
				}
				catch(event){}
				var data = {
					duration: duration,
					volume: this.V.volume,
					width: this.PD.offsetWidth || this.V.offsetWidth || this.V.width,
					height: this.PD.offsetHeight || this.V.offsetHeight || this.V.height,
					videoWidth: this.V.videoWidth,
					videoHeight: this.V.videoHeight,
					paused: this.V.paused
				};
				return data;
			} else {
				return this.V.getMetaDate();
			}
			return false;
		},
		/*
			�ӿں���
			ȡ��ǰ�ṩ�����������ŵ���Ƶ�б�
		*/
		getVideoUrl: function() {
			var arr = [];
			if(this.V.src) {
				arr.push(this.V.src);
			} else {
				var uArr = this.V.childNodes;
				for(var i = 0; i < uArr.length; i++) {
					arr.push(uArr[i].src);
				}
			}
			return arr;
		},
		/*
			���ú���
			�򲥷����������һ���ı�
		*/
		addElement: function(attribute) {
			if(this.playerType == 'flashplayer') {
				return this.V.addElement(attribute);
			}
			var i = 0;
			var obj = {
				list: null,
				x: '100%',
				y: "50%",
				position: null,
				alpha: 1,
				backgroundColor: '',
				backAlpha: 1,
				backRadius: 0
			};
			obj = this.standardization(obj, attribute);
			var list = obj['list'];
			if(list == null) {
				return '';
			}
			var id = 'element' + this.randomString(10);
			var ele = document.createElement('div');
			ele.className = id;
			if(obj['x']) {
				ele.setAttribute('data-x', obj['x']);
			}
			if(obj['y']) {
				ele.setAttribute('data-y', obj['y']);
			}
			if(obj['position'] != null) {
				ele.setAttribute('data-position', obj['position'].join(','));
			}

			this.PD.appendChild(ele);
			var eid = this.getByElement(id);
			this.css(eid, {
				position: 'absolute',
				filter: 'alpha(opacity:' + obj['alpha'] + ')',
				opacity: obj['alpha'].toString(),
				width: '800px',
				zIndex: '20'
			});
			var bgid = 'elementbg' + this.randomString(10);
			var bgAlpha = obj['backAlpha'].toString();
			var bgColor = obj['backgroundColor'];
			var html = '';
			var idArr = [];
			if(!this.isUndefined(list) && list.length > 0) {
				var textObj, returnObj;
				for(i = 0; i < list.length; i++) {
					var newEleid = 'elementnew' + this.randomString(10);
					switch(list[i]['type']) {
						case 'image':
							textObj = {
								type: 'image',
								url: '',
								radius: 0, //Բ�ǻ���
								width: 30, //���������Ҫ����
								height: 30, //����ߣ�����Ҫ����
								alpha: 1, //͸����
								paddingLeft: 0, //��߾���
								paddingRight: 0, //�ұ߾���
								paddingTop: 0,
								paddingBottom: 0,
								marginLeft: 0,
								marginRight: 0,
								marginTop: 0,
								marginBottom: 0,
								backgroundColor: '#FFFFFF',
							};
							list[i] = this.standardization(textObj, list[i]);
							html += '<div class="' + newEleid + '"><img class="' + newEleid + '_image" src="' + list[i]['url'] + '"></div>';
							break;
						case 'text':
							textObj = {
								type: 'text', //˵�����ı�
								text: '', //�ı�����
								fontColor: '#FFFFFF',
								fontSize: 14,
								fontFamily: '"Microsoft YaHei", YaHei, "΢���ź�", SimHei,"\5FAE\8F6F\96C5\9ED1", "����",Arial',
								lineHeight: 0,
								alpha: 1, //͸����
								paddingLeft: 0, //��߾���
								paddingRight: 0, //�ұ߾���
								paddingTop: 0,
								paddingBottom: 0,
								marginLeft: 0,
								marginRight: 0,
								marginTop: 0,
								marginBottom: 0,
								backgroundColor: '',
								backAlpha: 1,
								backRadius: 0 //����Բ�ǻ��ȣ�֧������ͳһ���ã�Ҳ֧�ַֿ�����[30,20,20,50]����Ӧ�������ң����ң�����
							};
							list[i] = this.standardization(textObj, list[i]);
							html += '<div class="' + newEleid + '"><div class="' + newEleid + '_bg"></div><div class="' + newEleid + '_text">' + list[i]['text'] + '</div></div>';
							break;
						default:
							break;
					}
					idArr.push(newEleid);
				}
			}
			eid.innerHTML = '<div class="' + bgid + '"></div><div class="' + bgid + '_c">' + html + '</div>';
			this.css(bgid + '_c', {
				position: 'absolute',
				zIndex: '2'
			});
			for(i = 0; i < idArr.length; i++) {
				switch(list[i]['type']) {
					case 'image':
						this.css(idArr[i], {
							float: 'left',
							width: list[i]['width'] + 'px',
							height: list[i]['height'] + 'px',
							filter: 'alpha(opacity:' + list[i]['alpha'] + ')',
							opacity: list[i]['alpha'].toString(),
							marginLeft: list[i]['marginLeft'] + 'px',
							marginRight: list[i]['marginRight'] + 'px',
							marginTop: list[i]['marginTop'] + 'px',
							marginBottom: list[i]['marginBottom'] + 'px',
							borderRadius: list[i]['radius'] + 'px',
						});
						this.css(idArr[i] + '_image', {
							width: list[i]['width'] + 'px',
							height: list[i]['height'] + 'px',
							borderRadius: list[i]['radius'] + 'px'
						});
						break;
					case 'text':
						this.css(idArr[i] + '_text', {
							filter: 'alpha(opacity:' + list[i]['alpha'] + ')',
							opacity: list[i]['alpha'].toString(),
							borderRadius: list[i]['radius'] + 'px',
							fontFamily: list[i]['fontFamily'],
							fontSize: list[i]['fontSize'] + 'px',
							color: list[i]['fontColor'],
							lineHeight: list[i]['lineHeight'] > 0 ? list[i]['lineHeight'] + 'px' : '',
							paddingLeft: list[i]['paddingLeft'] + 'px',
							paddingRight: list[i]['paddingRight'] + 'px',
							paddingTop: list[i]['paddingTop'] + 'px',
							paddingBottom: list[i]['paddingBottom'] + 'px',
							whiteSpace: 'nowrap',
							position: 'absolute',
							zIndex: '3'
						});
						this.css(idArr[i], {
							float: 'left',
							width: this.getByElement(idArr[i] + '_text').offsetWidth + 'px',
							height: this.getByElement(idArr[i] + '_text').offsetHeight + 'px',
							marginLeft: list[i]['marginLeft'] + 'px',
							marginRight: list[i]['marginRight'] + 'px',
							marginTop: list[i]['marginTop'] + 'px',
							marginBottom: list[i]['marginBottom'] + 'px'
						});
						this.css(idArr[i] + '_bg', {
							width: this.getByElement(idArr[i] + '_text').offsetWidth + 'px',
							height: this.getByElement(idArr[i] + '_text').offsetHeight + 'px',
							filter: 'alpha(opacity:' + list[i]['backAlpha'] + ')',
							opacity: list[i]['backAlpha'].toString(),
							borderRadius: list[i]['backRadius'] + 'px',
							backgroundColor: list[i]['backgroundColor'],
							position: 'absolute',
							zIndex: '2'
						});
						break;
					default:
						break;
				}
			}
			this.css(bgid, {
				width: this.getByElement(bgid + '_c').offsetWidth + 'px',
				height: this.getByElement(bgid + '_c').offsetHeight + 'px',
				position: 'absolute',
				filter: 'alpha(opacity:' + bgAlpha + ')',
				opacity: bgAlpha,
				backgroundColor: bgColor,
				borderRadius: obj['backRadius'] + 'px',
				zIndex: '1'
			});
			this.css(eid, {
				width: this.getByElement(bgid).offsetWidth + 'px',
				height: this.getByElement(bgid).offsetHeight + 'px'
			});
			var eidCoor = this.calculationCoor(eid);
			this.css(eid, {
				left: eidCoor['x'] + 'px',
				top: eidCoor['y'] + 'px'
			});
			this.elementArr.push(eid.className);
			return eid;
		},
		/*
			���ú���
			��ȡԪ�������ԣ�����x,y,width,height,alpha
		*/
		getElement: function(element) {
			if(this.playerType == 'flashplayer') {
				return this.V.getElement(element);
			}
			var ele = element;
			if(typeof(element) == 'string') {
				ele = this.getByElement(element);
			}
			var coor = this.getCoor(ele);
			return {
				x: coor['x'],
				y: coor['y'],
				width: ele.offsetWidth,
				height: ele.offsetHeight,
				alpha: !this.isUndefined(this.css(ele, 'opacity')) ? parseFloat(this.css(ele, 'opacity')) : 1
			};
		},
		/*
			���ú���
			���ݽڵ��x,y�����ڲ������������
		*/
		calculationCoor: function(ele) {
			if(this.playerType == 'flashplayer') {
				return this.V.calculationCoor(ele);
			}
			if(ele==[]){
				return;
			}
			var x, y, position = [];
			var w = this.PD.offsetWidth,
				h = this.PD.offsetHeight;
			var ew = ele.offsetWidth,
				eh = ele.offsetHeight;
			if(!this.isUndefined(ele.dataset['x'])) {
				x = ele.dataset['x']
			}
			if(!this.isUndefined(ele.dataset['y'])) {
				y = ele.dataset['y']
			}
			if(!this.isUndefined(ele.dataset['position'])) {
				position = ele.dataset['position'].split(',');
			}
			if(position.length > 0) {
				position.push(null, null, null, null);
				var i = 0;
				for(i = 0; i < position.length; i++) {
					if(this.isUndefined(position[i]) || position[i] == null || position[i] == 'null' || position[i] == '') {
						position[i] = null;
					} else {
						position[i] = parseFloat(position[i]);
					}
				}

				if(position[2] == null) {
					switch(position[0]) {
						case 0:
							x = 0;
							break;
						case 1:
							x = parseInt((w - ew) * 0.5);
							break;
						default:
							x = w - ew;
							break;
					}
				} else {
					switch(position[0]) {
						case 0:
							x = position[2];
							break;
						case 1:
							x = parseInt(w * 0.5) + position[2];
							break;
						default:
							x = w + position[2];
							break;
					}
				}
				if(position[3] == null) {
					switch(position[1]) {
						case 0:
							y = 0;
							break;
						case 1:
							y = parseInt((h - eh) * 0.5);
							break;
						default:
							y = h - eh;
							break;
					}
				} else {
					switch(position[1]) {
						case 0:
							y = position[3];
							break;
						case 1:
							y = parseInt(h * 0.5) + position[3];
							break;
						default:
							y = h + position[3];
							break;
					}
				}
			} else {
				if(x.substring(x.length - 1, x.length) == '%') {
					x = Math.floor(parseInt(x.substring(0, x.length - 1)) * w * 0.01);
				}
				if(y.substring(y.length - 1, y.length) == '%') {
					y = Math.floor(parseInt(y.substring(0, y.length - 1)) * h * 0.01);
				}
			}

			return {
				x: x,
				y: y
			}

		},
		/*
			���ú���
			�޸�����Ԫ��������
		*/
		changeElementCoor: function() {
			for(var i = 0; i < this.elementArr.length; i++) {
				if(this.getByElement(this.elementArr[i])!=[]){
					var c = this.calculationCoor(this.getByElement(this.elementArr[i]));
					this.css(this.elementArr[i], {
						top: c['y'] + 'px',
						left: c['x'] + 'px'
					});
				}
			}
		},
		/*
			���ú���
			����Ч����
		*/
		tween: function() {
			var Tween = {
				None: { //�����˶�
					easeIn: function(t, b, c, d) {
						return c * t / d + b;
					},
					easeOut: function(t, b, c, d) {
						return c * t / d + b;
					},
					easeInOut: function(t, b, c, d) {
						return c * t / d + b;
					}
				},
				Quadratic: {
					easeIn: function(t, b, c, d) {
						return c * (t /= d) * t + b;
					},
					easeOut: function(t, b, c, d) {
						return -c * (t /= d) * (t - 2) + b;
					},
					easeInOut: function(t, b, c, d) {
						if((t /= d / 2) < 1) return c / 2 * t * t + b;
						return -c / 2 * ((--t) * (t - 2) - 1) + b;
					}
				},
				Cubic: {
					easeIn: function(t, b, c, d) {
						return c * (t /= d) * t * t + b;
					},
					easeOut: function(t, b, c, d) {
						return c * ((t = t / d - 1) * t * t + 1) + b;
					},
					easeInOut: function(t, b, c, d) {
						if((t /= d / 2) < 1) return c / 2 * t * t * t + b;
						return c / 2 * ((t -= 2) * t * t + 2) + b;
					}
				},
				Quartic: {
					easeIn: function(t, b, c, d) {
						return c * (t /= d) * t * t * t + b;
					},
					easeOut: function(t, b, c, d) {
						return -c * ((t = t / d - 1) * t * t * t - 1) + b;
					},
					easeInOut: function(t, b, c, d) {
						if((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
						return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
					}
				},
				Quintic: {
					easeIn: function(t, b, c, d) {
						return c * (t /= d) * t * t * t * t + b;
					},
					easeOut: function(t, b, c, d) {
						return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
					},
					easeInOut: function(t, b, c, d) {
						if((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
						return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
					}
				},
				Sine: {
					easeIn: function(t, b, c, d) {
						return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
					},
					easeOut: function(t, b, c, d) {
						return c * Math.sin(t / d * (Math.PI / 2)) + b;
					},
					easeInOut: function(t, b, c, d) {
						return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
					}
				},
				Exponential: {
					easeIn: function(t, b, c, d) {
						return(t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
					},
					easeOut: function(t, b, c, d) {
						return(t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
					},
					easeInOut: function(t, b, c, d) {
						if(t == 0) return b;
						if(t == d) return b + c;
						if((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
						return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
					}
				},
				Circular: {
					easeIn: function(t, b, c, d) {
						return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
					},
					easeOut: function(t, b, c, d) {
						return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
					},
					easeInOut: function(t, b, c, d) {
						if((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
						return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
					}
				},
				Elastic: {
					easeIn: function(t, b, c, d, a, p) {
						if(t == 0) return b;
						if((t /= d) == 1) return b + c;
						if(!p) p = d * .3;
						if(!a || a < Math.abs(c)) { a = c; var s = p / 4; } else var s = p / (2 * Math.PI) * Math.asin(c / a);
						return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
					},
					easeOut: function(t, b, c, d, a, p) {
						if(t == 0) return b;
						if((t /= d) == 1) return b + c;
						if(!p) p = d * .3;
						if(!a || a < Math.abs(c)) { a = c; var s = p / 4; } else var s = p / (2 * Math.PI) * Math.asin(c / a);
						return(a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
					},
					easeInOut: function(t, b, c, d, a, p) {
						if(t == 0) return b;
						if((t /= d / 2) == 2) return b + c;
						if(!p) p = d * (.3 * 1.5);
						if(!a || a < Math.abs(c)) { a = c; var s = p / 4; } else var s = p / (2 * Math.PI) * Math.asin(c / a);
						if(t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
						return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
					}
				},
				Back: {
					easeIn: function(t, b, c, d, s) {
						if(s == undefined) s = 1.70158;
						return c * (t /= d) * t * ((s + 1) * t - s) + b;
					},
					easeOut: function(t, b, c, d, s) {
						if(s == undefined) s = 1.70158;
						return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
					},
					easeInOut: function(t, b, c, d, s) {
						if(s == undefined) s = 1.70158;
						if((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
						return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
					}
				},
				Bounce: {
					easeIn: function(t, b, c, d) {
						return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
					},
					easeOut: function(t, b, c, d) {
						if((t /= d) < (1 / 2.75)) {
							return c * (7.5625 * t * t) + b;
						} else if(t < (2 / 2.75)) {
							return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
						} else if(t < (2.5 / 2.75)) {
							return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
						} else {
							return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
						}
					},
					easeInOut: function(t, b, c, d) {
						if(t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * .5 + b;
						else return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
					}
				}
			};
			return Tween;
		},
		/*
			�ӿں���
			����Ч��
			ele:Object=��Ҫ�����Ķ���,
			parameter:String=��Ҫ�ı�����ԣ�x,y,width,height,alpha,
			effect:String=Ч������,
			start:Int=��ʼֵ,
			end:Int=����ֵ,
			speed:Number=�˶�����������֧��С��
		*/
		animate: function(attribute) {
			if(this.playerType == 'flashplayer') {
				return this.V.animate(attribute);
			}
			var thisTemp = this;
			var animateId = 'animate_' + this.randomString();
			var obj = {
				element: null,
				parameter: 'x',
				static: false,
				effect: 'None.easeIn',
				start: null,
				end: null,
				speed: 0,
				overStop: false,
				pauseStop: false, //��ͣ����ʱ�����Ƿ���ͣ
				callBack: null
			};
			obj = this.standardization(obj, attribute);
			if(obj['element'] == null || obj['speed'] == 0) {
				return false;
			}
			var w = this.PD.offsetWidth,
				h = this.PD.offsetHeight;
			var effArr = (obj['effect'] + '.').split('.');
			var tweenFun = this.tween()[effArr[0]][effArr[1]];
			var eleCoor = { x: 0, y: 0 };
			if(this.isUndefined(tweenFun)) {
				return false;
			}
			//�Ƚ���Ԫ����Ԫ��������ɾ�������䲻�ٸ��沥�����ĳߴ�ı���ı�λ��
			var def = this.arrIndexOf(this.elementArr, obj['element'].className);
			if(def > -1) {
				this.elementArr.splice(def, 1);
			}
			//var run = true;
			var css = {};
			//�Դ��ݵĲ�������ת����x��yת����left,top
			var pm = this.getElement(obj['element']); //����x,y,width,height,alpha����
			var t = 0; //��ǰʱ��
			var b = 0; //��ʼֵ
			var c = 0; //�仯��
			var d = obj['speed'] * 1000; //����ʱ��
			var timerTween = null;
			var tweenObj = null;
			var start = obj['start'] == null ? '' : obj['start'].toString();
			var end = obj['end'] == null ? '' : obj['end'].toString();
			switch(obj['parameter']) {
				case 'x':
					if(obj['start'] == null) {
						b = pm['x'];
					} else {
						if(start.substring(start.length - 1, start.length) == '%') {
							b = parseInt(start) * w * 0.01;
						} else {
							b = parseInt(start);
						}

					}
					if(obj['end'] == null) {
						c = pm['x'] - b;
					} else {
						if(end.substring(end.length - 1, end.length) == '%') {
							c = parseInt(end) * w * 0.01 - b;
						} else if(end.substring(0, 1) == '-' || end.substring(0, 1) == '+') {
							if(typeof(obj['end']) == 'number') {
								c = parseInt(obj['end']) - b;
							} else {
								c = parseInt(end);
							}

						} else {
							c = parseInt(end) - b;
						}
					}
					break;
				case 'y':
					if(obj['start'] == null) {
						b = pm['y'];
					} else {
						if(start.substring(start.length - 1, start.length) == '%') {
							b = parseInt(start) * h * 0.01;
						} else {
							b = parseInt(start);
						}

					}
					if(obj['end'] == null) {
						c = pm['y'] - b;
					} else {
						if(end.substring(end.length - 1, end.length) == '%') {
							c = parseInt(end) * h * 0.01 - b;
						} else if(end.substring(0, 1) == '-' || end.substring(0, 1) == '+') {
							if(typeof(obj['end']) == 'number') {
								c = parseInt(obj['end']) - b;
							} else {
								c = parseInt(end);
							}
						} else {
							c = parseInt(end) - b;
						}
					}
					break;
				case 'alpha':
					if(obj['start'] == null) {
						b = pm['alpha'] * 100;
					} else {
						if(start.substring(start.length - 1, start.length) == '%') {
							b = parseInt(obj['start']);
						} else {
							b = parseInt(obj['start'] * 100);
						}

					}
					if(obj['end'] == null) {
						c = pm['alpha'] * 100 - b;
					} else {
						if(end.substring(end.length - 1, end.length) == '%') {
							c = parseInt(end) - b;
						} else if(end.substring(0, 1) == '-' || end.substring(0, 1) == '+') {
							if(typeof(obj['end']) == 'number') {
								c = parseInt(obj['end']) * 100 - b;
							} else {
								c = parseInt(obj['end']) * 100;
							}
						} else {
							c = parseInt(obj['end']) * 100 - b;
						}
					}
					break;
			}
			var callBack = function() {
				var index = thisTemp.arrIndexOf(thisTemp.animateElementArray, animateId);
				if(index > -1) {
					thisTemp.animateArray.splice(index, 1);
					thisTemp.animateElementArray.splice(index, 1);
				}
				index = thisTemp.arrIndexOf(thisTemp.animatePauseArray, animateId);
				if(index > -1) {
					thisTemp.animatePauseArray.splice(index, 1);
				}
				if(obj['callBack'] != null && obj['element'] && obj['callBack'] != 'callBack' && obj['callBack'] != 'tweenX' && obj['tweenY'] != 'callBack' && obj['callBack'] != 'tweenAlpha') {
					var cb = eval(obj['callBack']);
					cb(obj['element']);
					obj['callBack'] = null;
				}
			};
			var stopTween = function() {
				if(timerTween != null) {
					if(timerTween.runing) {
						timerTween.stop();
					}
					timerTween = null;
				}
			};
			var tweenX = function() {
				if(t < d) {
					t += 10;
					css = {
						left: Math.ceil(tweenFun(t, b, c, d)) + 'px'
					};
					if(obj['static']) {
						eleCoor = thisTemp.calculationCoor(obj['element']);
						css['top'] = eleCoor['y'] + 'px';
					}
					thisTemp.css(obj['element'], css);

				} else {
					stopTween();
					thisTemp.elementArr.push(obj['element'].className);
					callBack();
				}
			};
			var tweenY = function() {
				if(t < d) {
					t += 10;
					css = {
						top: Math.ceil(tweenFun(t, b, c, d)) + 'px'
					};
					if(obj['static']) {
						eleCoor = thisTemp.calculationCoor(obj['element']);
						css['left'] = eleCoor['x'] + 'px';
					}
					thisTemp.css(obj['element'], css);
				} else {
					stopTween();
					thisTemp.elementArr.push(obj['element'].className);
					callBack();
				}
			};
			var tweenAlpha = function() {
				if(t < d) {
					t += 10;
					eleCoor = thisTemp.calculationCoor(obj['element']);
					var ap = Math.ceil(tweenFun(t, b, c, d)) * 0.01;
					css = {
						filter: 'alpha(opacity:' + ap + ')',
						opacity: ap.toString()
					};
					if(obj['static']) {
						eleCoor = thisTemp.calculationCoor(obj['element']);
						css['top'] = eleCoor['y'] + 'px';
						css['left'] = eleCoor['x'] + 'px';
					}
					thisTemp.css(obj['element'], css);
				} else {
					stopTween();
					thisTemp.elementArr.push(obj['element'].className);
					callBack();
				}
			};
			switch(obj['parameter']) {
				case 'x':
					tweenObj = tweenX;
					break;
				case 'y':
					tweenObj = tweenY;
					break;
				case 'alpha':
					tweenObj = tweenAlpha;
					break;
				default:
					break;
			}
			timerTween = new thisTemp.timer(10, tweenObj);
			if(obj['overStop']) {
				var mouseOver = function() {
					if(timerTween != null && timerTween.runing) {
						timerTween.stop();
					}
				};
				this.addListener('mouseover', mouseOver, obj['element']);
				var mouseOut = function() {
					var start = true;
					if(obj['pauseStop'] && thisTemp.getMetaDate()['paused']) {
						start = false;
					}
					if(timerTween != null && !timerTween.runing && start) {
						timerTween.start();
					}
				};
				this.addListener('mouseout', mouseOut, obj['element']);
			}

			this.animateArray.push(timerTween);
			this.animateElementArray.push(animateId);
			if(obj['pauseStop']) {
				this.animatePauseArray.push(animateId);
			}
			return animateId;
		},
		/*
			�ӿں�������
			��������animate
		*/
		animateResume: function(id) {
			if(this.playerType == 'flashplayer') {
				this.V.animateResume(this.isUndefined(id) ? '' : id);
				return;
			}
			var arr = [];
			if(id != '' && !this.isUndefined(id) && id != 'pause') {
				arr.push(id);
			} else {
				if(id === 'pause') {
					arr = this.animatePauseArray;
				} else {
					arr = this.animateElementArray;
				}
			}
			for(var i = 0; i < arr.length; i++) {
				var index = this.arrIndexOf(this.animateElementArray, arr[i]);
				if(index > -1) {
					this.animateArray[index].start();
				}
			}

		},
		/*
			�ӿں���
			��ͣ����animate
		*/
		animatePause: function(id) {
			if(this.playerType == 'flashplayer') {
				this.V.animatePause(this.isUndefined(id) ? '' : id);
				return;
			}
			var arr = [];
			if(id != '' && !this.isUndefined(id) && id != 'pause') {
				arr.push(id);
			} else {
				if(id === 'pause') {
					arr = this.animatePauseArray;
				} else {
					arr = this.animateElementArray;
				}
			}
			for(var i = 0; i < arr.length; i++) {
				var index = this.arrIndexOf(this.animateElementArray, arr[i]);
				if(index > -1) {
					this.animateArray[index].stop();
				}
			}
		},
		/*
			���ú���
			����IDɾ���������Ӧ������
		*/
		deleteAnimate: function(id) {
			var index = this.arrIndexOf(this.animateElementArray, id);
			if(index > -1) {
				this.animateArray.splice(index, 1);
				this.animateElementArray.splice(index, 1);
			}
		},
		/*
			���ú���
			ɾ���ⲿ�½���Ԫ��
		*/
		deleteElement: function(ele) {
			if(this.playerType == 'flashplayer' && this.V) {
				try{
					this.V.deleteElement(ele);
				}
				catch(event){}
				return;
			}
			//�Ƚ���Ԫ����Ԫ��������ɾ�������䲻�ٸ��沥�����ĳߴ�ı���ı�λ��
			var def = this.arrIndexOf(this.elementArr, ele.className);
			if(def > -1) {
				this.elementArr.splice(def, 1);
			}
			this.deleteAnimate(ele);
			this.deleteChild(ele);

		},
		/*
			--------------------------------------------------------------
			���ú�������
			���º�������ֻ���ڱ�������ʹ�ã�Ҳ������ҳ��������Ŀ��ʹ��
			����ID��ȡԪ�ض���
		*/
		getByElement: function(obj, parent) {
			if(this.isUndefined(parent)) {
				parent = document;
			}
			var num = obj.substr(0, 1);
			var res = [];
			if(num != '#') {
				if(num == '.') {
					obj = obj.substr(1, obj.length);
				}
				if(parent.getElementsByClassName) {
					res = parent.getElementsByClassName(obj);
				} else {
					var reg = new RegExp(' ' + obj + ' ', 'i');
					var ele = parent.getElementsByTagName('*');

					for(var i = 0; i < ele.length; i++) {
						if(reg.test(' ' + ele[i].className + ' ')) {
							res.push(ele[i]);
						}
					}
				}

				if(res.length > 0) {
					return res[0];
				} else {
					return res;
				}
			} else {
				if(num == '#') {
					obj = obj.substr(1, obj.length);
				}
				return document.getElementById(obj);
			}
		},
		/*
		 	���ú���
			���ܣ��޸���ʽ���ȡָ����ʽ��ֵ��
				elem��ID�����ID��Ӧ���ַ�������������һ�����ã������ʹ������
				attribute����ʽ���ƻ��������Ƕ�����ʡ�Ե�valueֵ
				value��attributeΪ��ʽ����ʱ���������ʽֵ
				ʾ��һ��
				this.css(ID,'width','100px');
				ʾ������
				this.css('id','width','100px');
				ʾ������
				this.css([ID1,ID2,ID3],'width','100px');
				ʾ���ģ�
				this.css(ID,{
					width:'100px',
					height:'100px'
				});
				ʾ����(��ȡ���)��
				var width=this.css(ID,'width');
		*/
		css: function(elem, attribute, value) {
			var i = 0;
			var k = '';
			if(typeof(elem) == 'object') { //���������
				if(!this.isUndefined(typeof(elem.length))) { //˵��������
					for(i = 0; i < elem.length; i++) {
						var el;
						if(typeof(elem[i]) == 'string') {
							el = this.getByElement(elem[i])
						} else {
							el = elem[i];
						}
						if(typeof(attribute) != 'object') {
							if(!this.isUndefined(value)) {
								el.style[attribute] = value;
							}
						} else {
							for(k in attribute) {
								if(!this.isUndefined(attribute[k])) {
									el.style[k] = attribute[k];
								}
							}
						}
					}
					return;
				}

			}
			if(typeof(elem) == 'string') {
				elem = this.getByElement(elem);
			}

			if(typeof(attribute) != 'object') {
				if(!this.isUndefined(value)) {
					elem.style[attribute] = value;
				} else {
					if(!this.isUndefined(elem.style[attribute])) {
						return elem.style[attribute];
					} else {
						return false;
					}
				}
			} else {
				for(k in attribute) {
					if(!this.isUndefined(attribute[k])) {
						elem.style[k] = attribute[k];
					}
				}
			}

		},
		/*
			���ú���
			�жϱ����Ƿ���ڻ�ֵ�Ƿ�Ϊundefined
		*/
		isUndefined: function(value) {
			try {
				if(value == 'undefined' || value == undefined) {
					return true;
				}
			} catch(event) {}
			return false;
		},

		/*
			���ú���
			�������������÷�ʽ��
			this.addListener('click',function(event){},[ID]);
			dֵΪ��ʱ�����ʾ������ǰ����Ƶ������
		*/
		addListener: function(e, f, d, t) {
			if(this.playerType=='flashplayer' && this.isUndefined(d)) {
				var ff = ''; //����������flashplayer���ݵĺ����ַ�
				if(typeof(f) == 'function') {
					ff = this.getParameterNames(f);
				}
				this.V.addListener(e, ff);
				return;
			}
			if(this.isUndefined(t)) {
				t = false
			}
			if(e == 'full') {
				this.fullFunArr.push(f);
				return;
			}
			if(e == 'error' && this.isUndefined(d)) {
				this.errorFunArr.push(f);
				return;
			}
			if(e == 'videochange') {
				this.videoChangeFunArr.push(f);
				return;
			}
			var o = this.V;
			if(!this.isUndefined(d)) {
				o = d;
			}
			this.listenerArr.push([e, f, d, t]);
			if(o.addEventListener) {
				try {
					o.addEventListener(e, f, t);
				} catch(event) {}
			} else if(o.attachEvent) {
				try {
					o.attachEvent('on' + e, f);
				} catch(event) {}
			} else {
				o['on' + e] = f;
			}
		},
		/*
			���ú���
			ɾ���������������÷�ʽ��
			this.removeListener('click',function(event){}[,ID]);
			dֵΪ��ʱ�����ʾ������ǰ����Ƶ������
		*/
		removeListener: function(e, f, d, t) {
			if(this.playerType=='flashplayer' && this.getParameterNames(f) && this.isUndefined(d)) {
				return;
			}
			if(this.isUndefined(t)) {
				t = false
			}
			if(e == 'full') {
				this.delFullFunArr(f);
				return;
			}
			if(e == 'error') {
				this.delErrorFunArr(f);
				return;
			}
			if(e == 'videochange') {
				this.delVideoChangeFunArr(f);
				return;
			}
			var o = this.V;
			if(!this.isUndefined(d)) {
				o = d;
			}
			for(var i = 0; i < this.listenerArr.length; i++) {
				if([e, f, d, t] == this.listenerArr[i]) {
					this.listenerArr.splice(i, 1);
					break;
				}
			}
			if(o.removeEventListener) {
				try {
					this.addNum--;
					o.removeEventListener(e, f, t);
				} catch(e) {}
			} else if(o.detachEvent) {
				try {
					o.detachEvent('on' + e, f);
				} catch(e) {}
			} else {
				o['on' + e] = null;
			}
		},
		/*
			���ú���
			��ȡ�������ƣ��� function chplayer(){} var fun=chplayer����getParameterNames(fun)=chplayer
		*/
		getParameterNames: function(fn) {
			if(typeof(fn) !== 'function') {
				return false;
			}
			var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
			var code = fn.toString().replace(COMMENTS, '');
			var result = code.slice(code.indexOf(' ') + 1, code.indexOf('('));
			return result === null ? false : result;
		},
		/*
			���ú���
			��ȡ��ǰ����ʱ��
		*/
		getNowDate: function() {
			var nowDate = new Date();
			var month = nowDate.getMonth() + 1;
			var date = nowDate.getDate();
			var hours = nowDate.getHours();
			var minutes = nowDate.getMinutes();
			var seconds = nowDate.getSeconds();
			var tMonth = '',
				tDate = '',
				tHours = '',
				tMinutes = '',
				tSeconds = '',
			tSeconds = (seconds < 10) ? '0' + seconds : seconds + '',
			tMinutes = (minutes < 10) ? '0' + minutes : minutes + '',
			tHours = (hours < 10) ? '0' + hours : hours + '',
			tDate = (date < 10) ? '0' + date : date + '',
			tMonth = (month < 10) ? '0' + month : month + '';
			return tMonth + '/' + tDate + ' ' + tHours + ':' + tMinutes + ':' + tSeconds;
		},
		/*
			���ú���
			��ʽ��ʱ����
			seconds:Int������
			ishours:Boolean���Ƿ���ʾСʱ��������ó�false�������ʾ��80:20����ʾ1Сʱ20����20��
		*/
		formatTime: function(seconds, ishours) {
			var tSeconds = '',
				tMinutes = '',
				tHours = '';
			if(isNaN(seconds)) {
				seconds = 0;
			}
			var s = Math.floor(seconds % 60),
				m = 0,
				h = 0;
			if(ishours) {
				m = Math.floor(seconds / 60) % 60;
				h = Math.floor(seconds / 3600);
			} else {
				m = Math.floor(seconds / 60);
			}
			tSeconds = (s < 10) ? '0' + s : s + '';
			tMinutes = (m > 0) ? ((m < 10) ? '0' + m + ':' : m + ':') : '00:';
			tHours = (h > 0) ? ((h < 10) ? '0' + h + ':' : h + ':') : '';
			if(ishours) {
				return tHours + tMinutes + tSeconds;
			} else {
				return tMinutes + tSeconds;
			}
		},
		/*
			���ú���
			��ȡһ������ַ�
			len������ַ�����
		*/
		randomString: function(len) {
			len = len || 16;
			var chars = 'abcdefghijklmnopqrstuvwxyz';
			var maxPos = chars.length;����
			var val = '';
			for(i = 0; i < len; i++) {
				val += chars.charAt(Math.floor(Math.random() * maxPos));
			}
			return 'ch' + val;
		},
		/*
			���ú���
			��ȡ�ַ�������,��������,Ӣ��������1
		*/
		getStringLen: function(str) {
			var len = 0;
			for(var i = 0; i < str.length; i++) {
				if(str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
					len += 2;
				} else {
					len++;
				}
			}
			return len;
		},
		/*
			�ڲ�����
			����Ϊajax�ṩ֧��
		*/
		createXHR: function() {
			if(window.XMLHttpRequest) {
				//IE7+��Firefox��Opera��Chrome ��Safari
				return new XMLHttpRequest();
			} else if(window.ActiveXObject) {
				//IE6 ������
				try {
					return new ActiveXObject('Microsoft.XMLHTTP');
				} catch(event) {
					try {
						return new ActiveXObject('Msxml2.XMLHTTP');
					} catch(event) {
						this.eject(this.errorList[7]);
					}
				}
			} else {
				this.eject(this.errorList[8]);
			}
		},
		/*
			���ú���
			ajax����
		*/
		ajax: function(cObj) {
			var thisTemp = this;
			var callback = null;
			var obj = {
				method: 'get', //��������
				dataType: 'json', //�������������
				charset: 'utf-8',
				async: false, //true��ʾ�첽��false��ʾͬ��
				url: '',
				data: null,
				success: null
			};
			if(typeof(cObj) != 'object') {
				this.eject(this.errorList[9]);
				return;
			}
			obj = this.standardization(obj, cObj);
			if(obj.dataType === 'json' || obj.dataType === 'text' || obj.dataType === 'html') {
				var xhr = this.createXHR();
				callback = function() {
					//�ж�http�Ľ����Ƿ�ɹ�
					if(xhr.status == 200) {
						if(obj.success == null) {
							return;
						}
						if(obj.dataType === 'json') {
							obj.success(eval('(' + xhr.responseText + ')')); //�ص����ݲ���
						} else {
							obj.success(xhr.responseText); //�ص����ݲ���
						}
					} else {
						thisTemp.eject(thisTemp.errorList[10], 'Ajax.status:' + xhr.status);
					}
				};
				obj.url = obj.url + '?rand=' + this.randomString(6);
				obj.data = this.formatParams(obj.data); //ͨ��params()����ֵ��ת�����ַ���
				if(obj.method === 'get' && !this.isUndefined(obj.data)) {
					obj.url += obj.url.indexOf('?') == -1 ? '?' + obj.data : '&' + obj.data;
				}
				if(obj.async === true) { //true��ʾ�첽��false��ʾͬ��
					xhr.onreadystatechange = function() {
						if(xhr.readyState == 4) { //�ж϶����״̬�Ƿ񽻻����
							callback(); //�ص�
						}
					};
				}
				xhr.open(obj.method, obj.url, obj.async);
				if(obj.method === 'post') {
					xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
					xhr.setRequestHeader('charset', obj['charset']);
					xhr.send(obj.data);
				} else {
					xhr.send(null); //get��ʽ����null
				}
				if(obj.async === false) { //ͬ��
					callback();
				}

			} else if(obj.dataType === 'jsonp') {
				var oHead = document.getElementsByTagName('head')[0];
				var oScript = document.createElement('script');
				var callbackName = 'callback' + new Date().getTime();
				var params = this.formatParams(obj.data) + '&callback=' + callbackName; //��ʱ���ƴ���ַ���
				callback = obj.success;
				//ƴ�Ӻ�src
				oScript.src = obj.url.split('?') + '?' + params;
				//����script��ǩ
				oHead.insertBefore(oScript, oHead.firstChild);
				//jsonp�Ļص�����
				window[callbackName] = function(json) {
					callback(json);
					oHead.removeChild(oScript);
				};
			}
		},
		/*
			���ú���
			��̬����js
		*/
		loadJs: function(path, success) {
			var oHead = document.getElementsByTagName('HEAD').item(0);
			var oScript = document.createElement('script');
			oScript.type = 'text/javascript';
			oScript.src = this.getNewUrl(path);
			oHead.appendChild(oScript);
			oScript.onload = function() {
				success();
			}
		},
		/*
			���ú���
			���������Ƿ�֧��HTML5-Video
		*/
		supportVideo: function() {
			if(!!document.createElement('video').canPlayType) {
				var vidTest = document.createElement("video");
				oggTest = vidTest.canPlayType('video/ogg; codecs="theora, vorbis"');
				if(!oggTest) {
					h264Test = vidTest.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
					if(!h264Test) {
						return false;
					} else {
						if(h264Test == "probably") {
							return true;
						} else {
							return false;
						}
					}
				} else {
					if(oggTest == "probably") {
						return true;
					} else {
						return false;
					}
				}
			} else {
				return false;
			}
		},
		/*
			���ú���
			����flashplayer�Ķ���
		*/
		getObjectById: function(id) {
			var x = null;
			var y = this.getByElement('#'+id);
			var r = 'embed';
			if(y && y.nodeName == 'OBJECT') {
				if(typeof(y.SetVariable) != 'undefined') {
					x = y;
				} else {
					var z = y.getElementsByTagName(r)[0];
					if(z) {
						x = z;
					}
				}
			}
			return x;
		},
		/*
			���ú���
			����ת��ַ�ַ���
		*/
		formatParams: function(data) {
			var arr = [];
			for(var i in data) {
				arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
			}
			return arr.join('&');
		},
		/*
			���ú���
			�Ե�ַ����ð������
		*/
		arrSort: function(arr) {
			var temp = [];
			for(var i = 0; i < arr.length; i++) {
				for(var j = 0; j < arr.length - i; j++) {
					if(!this.isUndefined(arr[j + 1]) && arr[j][3] < arr[j + 1][3]) {
						temp = arr[j + 1];
						arr[j + 1] = arr[j];
						arr[j] = temp;
					}
				}
			}
			return arr;
		},
		/*
			���ú���
			�ж��ļ���׺
		*/
		getFileExt: function(filepath) {
			if(filepath != '') {
				if(filepath.indexOf('?') > -1) {
					filepath = filepath.split('?')[0];
				}
				var pos = '.' + filepath.replace(/.+\./, '');
				return pos;
			}
			return '';
		},
		/*
			���ú���
			�����ַ���str�Ƿ����key
		*/
		isContains: function(str, key) {
			return str.indexOf(key) > -1;
		},
		/*
			���ú���
			����ַ��������
		*/
		getNewUrl: function(url) {
			if(this.isContains(url, '?')) {
				return url += '&' + this.randomString(8) + '=' + this.randomString(8);
			} else {
				return url += '?' + this.randomString(8) + '=' + this.randomString(8);
			}
		},
		/*
			���ú���
			��ȡclientX��clientY
		*/
		client: function(event) {
			var eve = event || window.event;
			if(this.isUndefined(eve)){
				eve={
					clientX:0,clientY:0
				};
			}
			return {
				x: eve.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft) - this.pdCoor['x'],
				y: eve.clientY + (document.documentElement.scrollTop || document.body.scrollTop) - this.pdCoor['y']
			}
		},
		/*
			���ú���
			��ȡ�ڵ�ľ�������
		*/
		getCoor: function(obj) {
			var coor = this.getXY(obj);
			return {
				x: coor['x'] - this.pdCoor['x'],
				y: coor['y'] - this.pdCoor['y']
			};
		},
		getXY: function(obj) {
			var parObj = obj;
			var left = obj.offsetLeft;
			var top = obj.offsetTop;
			while(parObj = parObj.offsetParent) {
				left += parObj.offsetLeft;
				top += parObj.offsetTop;
			}
			return {
				x: left,
				y: top
			};
		},
		/*
			���ú���
			ɾ�����������������
		*/
		removeChild: function() {
			if(this.playerType == 'html5video') {
				//ɾ����ʱ��
				var i = 0;
				var timerArr = [this.timerError, this.timerFull, this.timerTime, this.timerBuffer, this.timerClick, this.timerLoading, this.timerCBar, this.timerVCanvas];
				for(i = 0; i < timerArr.length; i++) {
					if(timerArr[i] != null) {
						if(timerArr[i].runing) {
							timerArr[i].stop();
						}
						timerArr[i] = null;
					}
				}
				//ɾ���¼�����
				var ltArr = this.listenerArr;
				for(i = 0; i < ltArr.length; i++) {
					this.removeListener(ltArr[i][0], ltArr[i][1], ltArr[i][2], ltArr[i][3]);
				}
			}
			this.playerType == '';
			this.V = null;
			this.deleteChild(this.CB['menu']);
			this.deleteChild(this.PD);
			this.CD.innerHTML = '';
		},
		/*
			���ú���
			����յ�ͼ��
		*/
		canvasFill: function(name, path) {
			name.beginPath();
			for(var i = 0; i < path.length; i++) {
				var d = path[i];
				if(i > 0) {
					name.lineTo(d[0], d[1]);
				} else {
					name.moveTo(d[0], d[1]);
				}
			}
			name.closePath();
			name.fill();
		},
		/*
			���ú���
			������
		*/
		canvasFillRect: function(name, path) {
			for(var i = 0; i < path.length; i++) {
				var d = path[i];
				name.fillRect(d[0], d[1], d[2], d[3]);
			}
		},
		/*
			���ú���
			ɾ�������ڵ�
		*/
		deleteChild: function(f) {
			var def = this.arrIndexOf(this.elementArr, f.className);
			if(def > -1) {
				this.elementArr.splice(def, 1);
			}
			var childs = f.childNodes;
			for(var i = childs.length - 1; i >= 0; i--) {
				f.removeChild(childs[i]);
			}

			if(f && f != null && f.parentNode) {
				try {
					if(f.parentNode) {
						f.parentNode.removeChild(f);

					}

				} catch(event) {}
			}
		},
		/*
			���ú���
		 	���������Ŀ��,�ڲ��ڵ�Ŀ�߼�����ڲ��ڵ�Ŀ�߼�����
		*/
		getProportionCoor: function(stageW, stageH, vw, vh) {
			var w = 0,
				h = 0,
				x = 0,
				y = 0;
			if(stageW / stageH < vw / vh) {
				w = stageW;
				h = w * vh / vw;
			} else {
				h = stageH;
				w = h * vw / vh;
			}
			x = (stageW - w) * 0.5;
			y = (stageH - h) * 0.5;
			return {
				width: parseInt(w),
				height: parseInt(h),
				x: parseInt(x),
				y: parseInt(y)
			};
		},
		/*
			���ú���
			����Ļ�ļ�����ת��������
		*/
		parseSrtSubtitles: function(srt) {
			var subtitles = [];
			var textSubtitles = [];
			var i = 0;
			var arrs = srt.split('\n');
			var arr = [];
			var delHtmlTag = function(str) {
				return str.replace(/<[^>]+>/g, ''); //ȥ�����е�html���
			};
			for(i = 0; i < arrs.length; i++) {
				if(arrs[i].replace(/\s/g, '').length > 0) {
					arr.push(arrs[i]);
				} else {
					if(arr.length > 0) {
						textSubtitles.push(arr);
					}
					arr = [];
				}
			}
			for(i = 0; i < textSubtitles.length; ++i) {
				var textSubtitle = textSubtitles[i];
				if(textSubtitle.length >= 2) {
					var sn = textSubtitle[0]; // ��Ļ�����
					var startTime = this.toSeconds(this.trim(textSubtitle[1].split(' --> ')[0])); // ��Ļ�Ŀ�ʼʱ��
					var endTime = this.toSeconds(this.trim(textSubtitle[1].split(' --> ')[1])); // ��Ļ�Ľ���ʱ��
					var content = [delHtmlTag(textSubtitle[2])]; // ��Ļ������
					// ��Ļ�����ж���
					if(textSubtitle.length > 2) {
						for(var j = 3; j < textSubtitle.length; j++) {
							content.push(delHtmlTag(textSubtitle[j]));
						}
					}
					// ��Ļ����
					var subtitle = {
						sn: sn,
						startTime: startTime,
						endTime: endTime,
						content: content
					};
					subtitles.push(subtitle);
				}
			}
			return subtitles;
		},
		/*
			���ú���
			��ʱ��,�ú���ģ��as3�е�timerԭ��
			time:��ʱʱ��,��λ:����
			fun:���ܺ���
			number:���д���,����������������
		*/
		timer: function(time, fun, number) {
			var thisTemp = this;
			this.time = 10; //���м��
			this.fun = null; //��������
			this.timeObj = null; //setInterval����
			this.number = 0; //�����д���
			this.numberTotal = null; //������Ҫ����
			this.runing = false; //��ǰ״̬
			this.startFun = function() {
				thisTemp.number++;
				thisTemp.fun();
				if(thisTemp.numberTotal != null && thisTemp.number >= thisTemp.numberTotal) {
					thisTemp.stop();
				}
			};
			this.start = function() {
				if(!thisTemp.runing) {
					thisTemp.runing = true;
					thisTemp.timeObj = window.setInterval(thisTemp.startFun, time);
				}
			};
			this.stop = function() {
				if(thisTemp.runing) {
					thisTemp.runing = false;
					window.clearInterval(thisTemp.timeObj);
					thisTemp.timeObj = null;
				}
			};
			if(time) {
				this.time = time;
			}
			if(fun) {
				this.fun = fun;
			}
			if(number) {
				this.numberTotal = number;
			}
			this.start();
		},
		/*
			���ú���
			��ʱ����ת������
		*/
		toSeconds: function(t) {
			var s = 0.0;
			if(t) {
				var p = t.split(':');
				for(i = 0; i < p.length; i++) {
					s = s * 60 + parseFloat(p[i].replace(',', '.'));
				}
			}
			return s;
		},
		/*
			���ú���
			������Object��׼��
		*/
		standardization: function(o, n) { //n�滻��o
			var h = {};
			var k;
			for(k in o) {
				h[k] = o[k];
			}
			for(k in n) {
				var type = typeof(h[k]);
				switch(type) {
					case 'number':
						h[k] = parseFloat(n[k]);
						break;
					case 'string':
						if(typeof(n[k]) != 'string' && typeof(n[k]) != 'undefined') {
							h[k] = n[k].toString();
						} else {
							h[k] = n[k];
						}
						break;
					default:
						h[k] = n[k];
						break;
				}

			}
			return h;
		},
		/*
			���ú���
			��������
		 */
		arrIndexOf: function(arr, key) {
			var re = new RegExp(key, ['']);
			return(arr.toString().replace(re, '��').replace(/[^,��]/g, '')).indexOf('��');
		},
		/*
			���ú���
			ȥ���ո�
		 */
		trim: function(str) {
			 return str.replace(/(^\s*)|(\s*$)/g, '');
		},
		/*
			���ú���
			������ݵ�����̨
		*/
		log: function(val) {
			try {
				console.log(val);
			} catch(e) {}
		},
		/*
			���ú���
			������ʾ
		*/
		eject: function(er, val) {
			if(!this.vars['debug']){
				return;
			}
			var errorVal = er[1];
			if(!this.isUndefined(val)) {
				errorVal = errorVal.replace('[error]', val);
			}
			var value = 'error ' + er[0] + ':' + errorVal;
			try {
				alert(value);
			} catch(e) {}
		}
	};
	window.chplayer = chplayer;
})();
