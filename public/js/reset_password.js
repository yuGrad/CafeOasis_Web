const HOST_ADDR = "localhost:8080";

function sendEmailRandomUrl() {
	const email = document.getElementById("email").value;
	const name = document.getElementById("name").value;

	fetch(`http://${HOST_ADDR}/auth/password/reset-link`, {
		method: "post",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email: email, name: name }),
	})
		.then((response) => {
			if (response.ok) alert("이메일로 Url 전송되었습니다.");
			else {
				if (response.status === 401) alert("The names don't match");
				else alert("Server Error: 500");
			}
		})
		.catch((error) => {
			alert(`이메일 전송 실패: ${error.message}`);
		});
}

async function sendResetPassword() {
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;

	try {
		const response = await fetch(
			`http://${HOST_ADDR}/auth/password/new-password`,
			{
				method: "post",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email: email, password: password }),
			}
		);

		if (response.ok) {
			alert("패스워드가 성공적으로 변경됐습니다.");
			window.location.replace(`http://${HOST_ADDR}/auth/login`);
		} else {
			alert(data.message);
		}
	} catch (err) {
		alert("네트워크 오류, 다시 시도해보세요.");
	}
}
