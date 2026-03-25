package com.vpcnative.di

import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import com.vpcnative.data.api.VPCApi
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import javax.inject.Singleton

@Module @InstallIn(SingletonComponent::class)
object AppModule {
    @Provides @Singleton
    fun provideApi(): VPCApi = Retrofit.Builder()
        .baseUrl("https://api.vpcnative.com/")
        .addConverterFactory(GsonConverterFactory.create())
        .build().create(VPCApi::class.java)
}