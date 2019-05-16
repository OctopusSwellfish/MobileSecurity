var express = require('express');
var router = express.Router();

var Medicine = require('../models').Medicine;


router.get('/dbtest', function(req, res, next) {
	console.log("db get ??");
	res.send("response");
/*
	Medicine.create({
		name: '키미테패취',
		ingredient: '스코폴라민 1.5mg',
		period: '최소 4시간 전 귀 뒤의 털이 없는 건조한 피부의 표면에 성인 1회 1매 부착',
		effect: '멀미에 의한 구역/구토의 예방',
		caution: '협우각형 녹내장 환자, 연고깆에 과민증 환자, 서맥 환자, 배뇨장애 환자 부착 금지',
		company: '명문제약',
		
});
	Medicine.create({
		name: '스멕타현탁액',
		ingredient: '디옥타헤드랄스멕타이트 3g/20mL',
		period: '성인 1회 3g을 1일 3회 경구 복용',
		effect: '식도, 위/십이지장과 관련된 통증의 완화, 급 만성 설사 완화',
		caution: '다른 약과 시간을 두고 복용해야 함, 심한 만성 변비 환자, 임부, 장폐색 병력 환자 복약 금지',
		company: '대웅제약',
});
	Medicine.create({
		name: '클라리틴정',
		ingredient: '로라타딘 10mg',
		period: '체중 30kg 이상 성인 1일 1회 10mg 경구투여',
		effect: '알레르기성 비염, 만성 특발성 두드러기 완화',
		caution: '6세 미만의 소아, 임부, 유당불내증 있는 환자 투여 금지',	
		company: '바이엘코리아',
});
	Medicine.create({
		name: '테라플루데이타임건조시럽',
		ingredient: '아세트아미노펜 650mg/14.888g, 페닐레프린염산염 10mg/14.888g',
		period: '성인 1회 2~6mg 1일 2~4회 경구투여',
		effect: '감기의 제증상, 오한, 발열, 두통, 관절통의 완화',
		caution: '심한 심기능부전 환자, 고혈압 환자, 소화성궤양 환자, 혈액이상 환자 투여 금지',
		company: '수입',
});
	Medicine.create({
		name: '활명수',
		ingredient: 'L-멘톨 21mg/75mL, 건강 12mg/75mL, 계피 30mg/75mL, 고추틴크 0.06mL/75mL 등',
		period: '만 15세 이상 성인 1회 1병 (75ml) 경구투여',
		effect: '식욕감퇴, 위부팽만감, 소화불량, 과식, 체함, 구여, 구토 완화',
		caution: '만 3개월 미만의 젖먹이에게 투여 금지',
		company: '동화약품',
});
	Medicine.create({
		name: '아마릴정 1mg',
		ingredient: '글리메피리드 1mg',
		period: '각 환자에 대해 개별적으로 조절, 물 1/2컵 이상과 함께 씹지 않고 1일 1회 경구투여',
		effect: '제 2형 당뇨병 환자의 혈당조절을 향상시키기 위한 식사요법 및 운동요법의 보조제',
		caution: '제 1형 당뇨병 환자 투여 금지, 설포닐우레아계, 설폰아미드계 약물에 대해 과민반응의 병력이 있는 환자 투여 금지',
		company: '한독',
});
	Medicine.create({
		name: '글리벡필름코팅정 100mg',
		ingredient: '이매티닙메실레이트 119.5mg',
		period: '성인 필라델피아 염색체 양성인 만성기 만성골수성백혈병 환자 1일 1회 400mg용량 경구투여 권장',
		effect: '만성골수성백혈병 치료제',
		caution: '이 약이나 다른 성분에 과민성이 있는 환자, 임부, 수유부 투여 금지',
		company: '한국노바티스',
});
	Medicine.create({
		name: '플라빅스정 75mg',
		ingredient: '클로피도그렐황산염 97.875mg',
		period: '성인 허혈뇌졸중, 심근경색 또는 말초동맥성 질환이 있는 환자에게 1일 1회 75mg 경구투여',
		effect: '허혈뇌졸중, 심근경색 또는 말초동맥성질환이 있는 성인 환자에서 죽상동맥경화성 증상의 개선',
		caution: '유전적으로 CYP2C19의 기능이 저하된 환자는 주의, 출혈이 있는 환자, 중증의 간 손상 환자, 수유부 투여 금지',
		company: '한독',
});
	Medicine.create({
		name: '로라반정 1mg',
		ingredient: '로라제팜 1mg',
		period: '성인 1일 1~4mg을 2~3회 분할 경구투여',
		effect: '신경증에서의 불안/긴장/우울 완화, 정신신체장애에서의 불안/긴장/우울 완화',
		caution: '중증의 근무력증 환자, 급성 좁은앞방각 녹내장 환자, 호흡부전, 수면무호흡증후군 환자 투여 금지',
		company: '환인제약',
});
	Medicine.create({
		name: '부광메티마졸정',
		ingredient: '메티마졸 5mg',
		period: '성인 1일 초기량을 경증인 경우에는 15mg, 중등도인 경우에는 30-40mg, 중증인 경우에는 60mg을 8시간 간격으로 1일 3회 분할 경구투여',
		effect: '갑상선기능한징증',
		caution: '무과립구증, 백혈구감소증 및 혈소판감소증 환자, 수유부 투여 금지',
		company: '부광약품',
});
	Medicine.create({
		name: '동성정로환당의정',
		ingredient: '크레오소트 22.5mg, 현초가루 25mg, 황백엑스산 33.75mg',
		period: '성인 및 15세 이상 1회 4정 경구투여',
		effect: '설사, 체함, 묽은변, 토사 완화',
		caution: '임부, 수유부, 만7세 이하의 소화, 투석 치료를 받고 있는 사람 투여 금지',
		company: '동성제약',
});
	Medicine.create({
		name: '판콜에이내복액',
		ingredient: '구아이페네신 80mg/30mL, 구연산카르베타펜탄 15mg/30mL 등',
		period: '성인 1회 30ml 1일 3회 식후 30분에 경구투여',
		effect: '감기 제증상의 완화',
		caution: '메일 세 잔 이상 정기적으로 술을 마시는 사람이 이 약이나 다른 해열 진통제 복용할 경우 금지, 다른 아세트아미노펜 제품과 함께 복용 금지',
		company: '동화약품',
});
	Medicine.create({
		name: '신신카타파프',
		ingredient: 'D-캄파 700mg, L-멘톨 100mg, 살리실산메틸 600mg, 티몰 20mg',
		period: '성인 1일 1~2회 환부에 부착',
		effect: '삠, 타박상, 근육통, 관절통, 신경통의 완화',
		caution: '30개월 이하의 유아, 습진, 옻 등에 의한 피부염, 상처부위에 투여 금지',
		company: '신신제약',
});
	Medicine.create({
		name: '마이드린캡슐',
		ingredient: '디클로랄페나존 100mg, 아세트아미노펜 325mg, 이소메텝텐뮤케이트 65mg',
		period: '성인 1회 1~2캅셀을 1일 3회까지 경구투여',
		effect: '긴장성 두통 및 혈관성 두통(편두통)완화',
		caution: '녹내장 환자, 심한 신장애 환자, 고혈압 환자, 기질성 심장애 환자, 간장애 환자, MAO 저해제를 투여받고 있는 환자에 투여 금지',
		company: '녹십자',
});
	Medicine.create({
		name: '아락실과립',
		ingredient: '아기오락스과립 2.7g/4g',
		period: '1회 4~8g을 1일 1회 취침전 또는 2회 복용하되, 씹지 말고 통상 아침에는 냉수, 저녁에는 온수로 경구투여',
		effect: '변비, 변비에 따른 식욕부진, 복부팽만, 장내이상발효, 치질 증상 완화',
		caution: '급성 복부질환 환자, 장폐색 환자, 위장관내의 협착증 환자 투여 금지',
		company: '부광약품',
});
	Medicine.create({
		name: '라미실원스외용액',
		ingredient: '테르비나핀염산염 11.25mg/g',
		period: '단 1회 적용, 발가락 사이 모두 얇게 펴 바르고 발바닥 전체와 발바닥으로부터 약 1.5cm 높이까지 이 약을 적용하며 필름이 될 때까지 1~2분간 건조',
		effect: 'Trichophyton, Microsporum canis 및 Epidermophyton floccosum과 같은 피부 사샹균에 의한 피부 감염증 완화',
		caution: '테르비나핀 및 이 약 성분에 과민증이 있는 환자, 임부, 15세 미만 소아 투여 금지',
		company: '글락소스미스클라인컨슈머헬스케어코리아',
});
	Medicine.create({
		name: '크레오신티외용액 1%',
		ingredient: '클린다마이신포스페이트 11.88mg/mL',
		period: '성인 1일 2회 환부에 얇게 도포',
		effect: '프로피오니박테륨 아크네 살상, 심상성여드름(보통여드름)완화',
		caution: '클린다마이신이나 린코마이신에 과민반응의 병력이 있는 환자, 국한성회장염 또는 궤양성대장염의 병력이 있는 환자, 항생물질 관련 대장염의 병력이 있는 환자, 임부, 수유부, 12세 이하 소아 투여 금지',
		company: '한독',
});
	Medicine.create({
		name: '알보칠콘센트레이트액',
		ingredient: '폴리크레줄렌액(50w/w&) 720mg/g',
		period: '용액을 적신 거즈를 이용해 가벼운 압력으로 해당 부위를 1~3분간 도포',
		effect: '질 세균 감염, 구내염 및 치육염 완화',
		caution: '이 약 성분에 과민반응 환자 투여 금지',
		company: '에스트라',
});
	Medicine.create({
		name: '프로페시아정 1mg',
		ingredient: '피나스테리드 1mg',
		period: '성인 남성 1일 1회 1mg 식사여부와 관련업이 투여',
		effect: '성인 남성의 남성형 탈모증(안드로겐 탈모증)의 치료',
		caution: '소아 환자 혹은 여성에게 투여 절대 금지, 임부, 우울증 환자 투여 금지',
		company: '한국엠에스디',
});
	Medicine.create({
		name: '개비스콘츄어블정',
		ingredient: '알긴산나트륨 250mg, 탄산수소나트륨 133.5mg, 탄산칼슘 80mg',
		period: '성인 및 12세 이상의 소아 1회 2~4정 1일 4회 식후 및 취침전 경구투여',
		effect: '위 식도 역류 증상(산 역류, 속쓰림, 소화불량) 완화',
		caution: '울혈심부전, 신장애 등과 같이 나트륨을 매우 제한해야 하는 환자, 고칼슘혈증, 신석회침착증과 재발성 칼슘함유 신결석 환자, 만 12세 미만의 소아에게 투여 금지',
		company: '옥시레킷벤키저',
});
	Medicine.create({
		name: '이가탄에프캡슐',
		ingredient: '아스코르브산 150mg, 리소짐염산염 30mg, 토코페롤아세테이트2배산 10mg, 카르바조크롬 2mg',
		period: '성인 1회 1캡슐 1일 3회 식후 경구투여',
		effect: '치주치료 후 치은염, 경/중증도 치주염의 보조치료',
		caution: '15세 미만 소아 투여 금지',
		company: '명인제약',
});


*/

//끝
});


module.exports = router;

