%freq = 0.0272; % javascriptのsf=20と等しい
freq = 0.03
res = 1*[400 400];
sf = freq;
sc = 20;
phase = 10;
x = res(1)/2;
y = res(2)/2;
contrast = 100;
%tilt = 44.54; % javascriptのsf=50と等しい
tilt = 50
[gab_x, gab_y] = meshgrid(0:(res(1)-1), 0:(res(2)-1));
a=cos(deg2rad(tilt))*sf*360;
b=sin(deg2rad(tilt))*sf*360;
multConst=1/(sqrt(2*pi)*sc);
x_factor=-1*(gab_x-x).^2;
y_factor=-1*(gab_y-y).^2;
sinWave=sin(deg2rad(a*(gab_x - x) + b*(gab_y - y)+phase));
varScale=2*sc^2;
m=0.5 + contrast*(multConst*exp(x_factor/varScale+y_factor/varScale).*sinWave)'