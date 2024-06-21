const events = {
    'SUBMIT': 'submit'
}
// 회원 정보를 저장할 배열 생성
let members = [];

// 회원 데이터를 객체화 시킬 생성자 함수
function Member(mid, mname, mpw) {
    this.id = mid;
    this.name = mname;
    this.pw = mpw;
}

// 공통 함수 : 메서드 정의
Member.prototype.toString = function () {
    const makeHtml = 
    `
    <td> ${this.id} </td>
    <td> ${this.name} </td>
    <td> ${this.pw} </td>
    `
    return makeHtml;
}

// 데이터 저장함수
function addMember(member) {
    members.push(member);
    // 동기화
    setStorage();

    console.log(members);
    displayTable();
}

// 회원 데이터 저장 
function createMember() {
    // 사용자 입력 데이터 받기, document로 케스팅 후 value 속성 사용
    const id = document.getElementById('uid').value;
    const name = document.getElementById('uname').value;
    const pw = document.getElementById('pw').value;
    // 배열에 데이터 추가
    addMember(new Member(id, name, pw));

    document.getElementById('regForm').reset();

    // form 테그의 action 실행이 되지 않도록 반드시 return false
    return false;
}

// 회원 리스트 출력 기능
function displayTable() {

    let listHtml = 
    `<table  class="listtable">
        <tr>
            <th>index</th>
            <th>ID(이메일)</th>
            <th>비밀번호</th>
            <th>이름</th>
            <th>관리</th>
        </tr>
    `

    // 배열의 요소를 반복 테그 생성
    members.forEach((member, i) => {
        listHtml += `
        <tr>
            <td>${i}</td>
            <td>${member.id}</td>
            <td>${member.pw}</td>
            <td>${member.name}</td>
            <td> <a href="javascript:editSet('${i}')">수정</a> | <a href="javascript:deleteMember('${i}')">삭제</a> </td>
        </tr>
        `
    })

    listHtml += '</table>';

    const listTable = document.getElementById('list');
    listTable.innerHTML = listHtml;

}

// 리스트에서 선택한 회원의 데이터를 수정 폼에 Set
function editSet(idx){

    // 수정 폼 영역 출력
    document.getElementById('edit').style.display='block';

    // 사용자 입력 데이터 받기, document로 케스팅 후 value 속성 사용
    document.getElementById('eid').value=members[idx].id;
    document.getElementById('ename').value=members[idx].name;
    document.getElementById('epw').value=members[idx].pw;
    document.getElementById('idx').value=idx;

}

// 사용자 입력 데이터를 배열 요소 객체의 속성 값을 변경
function editMember() {
    // 사용자 입력 데이터 받기, document로 케스팅 후 value 속성 사용
    const id = document.getElementById('eid').value;
    const name = document.getElementById('ename').value;
    const pw = document.getElementById('epw').value;
    const idx = document.getElementById('idx').value;
    
    // 배열의 요소 인 Member 객체의 속성값을 변경.
    // setter/getter 메서드 구성해도 좋습니다.
    members[parseInt(idx)].id=id;
    members[parseInt(idx)].name=name;
    members[parseInt(idx)].pw=pw;

    document.getElementById('editForm').reset();

    // 리스트 테이블 갱신
    displayTable();
    // 동기화
    setStorage();


    alert("수정되었습니다.\n수정폼 화면을 숨깁니다.");
    // 수정 폼 영역 출력
    document.getElementById('edit').style.display='none';

    return false;

}

// 배열에서 데이터를 삭제
function deleteMember(idx){

    if(confirm('삭제하시겠습니까?')){
        members.splice(idx,1); // 배열 변화 발생
        // 화면 갱신
        displayTable();
        // 동기화
        setStorage();
    }
}



// localStorage 에 데이터 저장/수정/삭제 시에 업데이트
function setStorage(){
    // 데이터의 갱신 : 추가, 수정, 삭제
    localStorage.setItem('members', JSON.stringify(members));
}

// localStorage 의 데이터와 배열의 동기화
function initStorage(){
    
    // localStorage 에 저장되어 있는 데이터
    // 데이터가 없다면 null 리턴.
    const storageData = localStorage.getItem('members');

    if(storageData==null){
        // 프로그램 최초 시작 또는 데이터가 없는 상태
        localStorage.setItem('members', JSON.stringify(members));
    } else {
        // 저장되어 있는 JSON 데이터를 배열 객체로 변환 
        members = JSON.parse(storageData);
    }

}





document.addEventListener('DOMContentLoaded', () => {

    // 페이지가 로드된 것은 프로그램을 시작하는 시점이다.
    // 저장된 데이터를 배열 객체로 변환
    initStorage();

    // 로드된 데이터를 테이블로 화면에 출력
    displayTable();


    // 입력 폼 casting -> onsubmit Event 
    document.getElementById('regForm').addEventListener(events.SUBMIT, (event) => {
        event.preventDefault();
        // a, form submit : 실행하지 않는다.
        // createMember
    }); 

    // 수정 폼 casting -> onsubmit Event 
    document.getElementById('editForm').addEventListener(events.SUBMIT, editMember);
})

