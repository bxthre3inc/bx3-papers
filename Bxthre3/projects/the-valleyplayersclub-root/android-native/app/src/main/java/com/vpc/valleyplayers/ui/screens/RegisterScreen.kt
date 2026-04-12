package com.vpc.valleyplayers.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.vpc.valleyplayers.data.api.VPCApiService

@Composable
fun RegisterScreen(onRegistered: () -> Unit, onBack: () -> Unit) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirm by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }

    Box(modifier = Modifier.fillMaxSize().background(androidx.compose.ui.graphics.Color(0xFF0D0015)), contentAlignment = Alignment.Center) {
        Column(modifier = Modifier.padding(32.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Text("\uD83C\uDFB2", fontSize = 48.sp)
            Spacer(Modifier.height(8.dp))
            Text("Create Account", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = 0xFFFFD700.let { androidx.compose.ui.graphics.Color(it) })

            Spacer(Modifier.height(32.dp))

            OutlinedTextField(value = email, onValueChange = { email = it }, label = { Text("Email") }, modifier = Modifier.fillMaxWidth(), singleLine = true, keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email))
            Spacer(Modifier.height(12.dp))
            OutlinedTextField(value = password, onValueChange = { password = it }, label = { Text("Password") }, modifier = Modifier.fillMaxWidth(), singleLine = true, visualTransformation = PasswordVisualTransformation(), keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password))
            Spacer(Modifier.height(12.dp))
            OutlinedTextField(value = confirm, onValueChange = { confirm = it }, label = { Text("Confirm Password") }, modifier = Modifier.fillMaxWidth(), singleLine = true, visualTransformation = PasswordVisualTransformation(), keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password))

            if (error != null) { Spacer(Modifier.height(8.dp)); Text(error!!, color = 0xFFEF4444.let { androidx.compose.ui.graphics.Color(it) }, fontSize = 14.sp) }

            Spacer(Modifier.height(24.dp))

            Button(onClick = {
                if (password != confirm) { error = "Passwords do not match"; return@Button }
                loading = true; error = null
                VPCApiService.register(email, password) { ok, msg ->
                    loading = false
                    if (ok) onRegistered() else error = msg
                }
            }, modifier = Modifier.fillMaxWidth().height(52.dp), enabled = !loading && email.isNotBlank() && password.isNotBlank() && confirm.isNotBlank(), colors = ButtonDefaults.buttonColors(containerColor = 0xFF6B21A8.let { androidx.compose.ui.graphics.Color(it) })) {
                Text(if (loading) "Creating..." else "Create Account", fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }

            Spacer(Modifier.height(12.dp))
            TextButton(onClick = onBack) { Text("Back to Sign In", color = 0xFFFFD700.let { androidx.compose.ui.graphics.Color(it) }) }
        }
    }
}
