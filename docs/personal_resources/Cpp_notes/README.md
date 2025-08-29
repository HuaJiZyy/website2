## C++ 笔记 <!-- {docsify-ignore} -->

```
C++代码到可执行文件的过程:
main.cpp→预处理(main.i)→编译(main.s)→汇编(main.o)→链接(main.out(macos/linux)/main.exe(windows))
预处理: 处理预处理指令(如#include、#define等), 展开宏定义(如#include <iostream>会把iostream头文件的内容插入到代码中), 移除注释
编译: 将预处理后的代码转换为汇编代码
汇编: 将汇编代码转换为机器代码(0和1的二进制形式)
链接：将多个目标文件和库文件链接成一个可执行文件

1.头文件
为了解决多个源文件重复声明过多信息的复杂性, 可以使用头文件提供函数、类、变量等信息的声明, 但不提供其具体实现. 通常来说, 类的声明和成员函数的声明写在头文件中(让用户可见), 函数体写在cpp文件中(让用户不可见).
下面是一些常用头文件:
#inlcude <cmath>
#include <cstdio>
<iomanip> 用于控制cout输出格式
<cstring> /<string>  后者是C++的头文件,可以用+连接两个字符串
<iostream>
<fstream>
<vector>
特例:<malloc.h>

2.命名空间:用于创建同名变量或函数或类
建立:
namespace zyy
{
    int a;
}
使用:
整体引用    using namespace zyy;
单独使用    zyy::a

3.输入输出流库 头文件:<iostream>
属于标准命名空间std,使用时需要引用. using namespace std;

ostream类的对象 cout  运算符 <<
istream类的对象 cin   运算符 >>   int a; cin>>a;

cin cout可以连续使用
cout<<"Hello!"<<endl;  (endl表示换行,也属于std)

4. 访问和内部变量同名的全局变量,使用运算符 ::变量名

5.引用类型(数据结构中用过) 运算符: &(仅声明时使用),其他地方的&都是取地址
(1)
int a = 1;
int &b = a;  b是引用类型,是a的别名,修改b等于修改a. 引用类型声明时必须赋初值.
用做函数的形参后,修改形参会修改实参. void swap(int &a, int &b){...}
(2)函数返回引用类型
相当于函数不是返回值,而是返回了实体对象本身

const
(1)常变量
想使用引用类型但不想修改实参,则前面加const. void swap(const int &a, const int &b){...}  此时实参不能被修改,会报错
const类型变量定义时必须赋初值 例如:const int a = 5;
(2)指向const对象的指针:定义前加 const
可以改变所指的地址,但不可改变当前地址存储的值,常用于函数形参
const变量必须对应指向const的指针,反之不一定
(3)const类型的指针 int * const p
不能改变所指的地址,但可以改变当前地址存储的值
(4)所有引用类型都是const型,不能修改引用类型的变量引用的东西
(5)常函数 int f() const{} //在类中定义, 不能修改成员变量的值

6.内联函数 用于提高效率,编译时会直接将代码嵌入主调函数中,但不允许出现循环和switch语句
语法:
inline 函数定义            //即函数定义前面加inline即可

7.异常处理
用try块和throw判断异常(每个块中只throw一次),用catch捕获上面throw的东西.
try{
    if(...) throw "error!"
    throw "error1!"
}

catch(char* s){
}
catch(...){}  三个点可捕获所有其他情况

8.函数的默认参数
void swap(int a, int b);                      //声明
void swap(int a, int b=1){}                   //定义          声明和定义只有一个体现默认参数,另一个不体现
默认b的值为1 默认参数一律靠括号右 默认值可以是全局变量,但不可以是局部变量
调用时 swap(a) b为1 或 swap(a,2) b为2

9.重载
(1)函数重载(同名函数,但不同参数表) 类同java
(2)运算符重载 实质是函数重载
+重载
重载为普通函数时, 参数个数为运算符目数;
重载为成员函数时, 参数个数为运算符目数-1(左加数是*this, 参数只有右加数). 
=(赋值)重载
只能重载为成员函数(括号、->、[]也是这样)
方法是 返回值类型 operator 运算符(形参表){}
class vector{                     //vector是矢量的意思
    int x;
    int y;
    friend vector operator * (int a, vector b);        //友元函数, 可以在类外定义, 必须在类内声明, 可以访问private的成员变量
    friend class zyy;                                  //友元类声明, zyy类内可以访问vector类的私有内容. 友元都是单向的, 不是互相的
};

vector operator * (int a, vector b){
    vector new;
    new.x = a * b.x;
    new.y = a * b.y;
    return new;
}
之后就可以用 2 * vector型变量了 实现了向量的数乘
(3)cin,cout也可重载,以自定义输出格式, 不能做成员函数, 只能当友元
    ostream& operator<<(ostream &o, vector v){              //如果是cin,v要用引用类型&v
    cout<<v.x<<v.y<<endl;
    return o;
}
(4)下标运算符重载
必须做为成员函数
double BasicArray::operator[](int ind) const       //负责读    cout<<a[1]
double &BasicArray::operator[](int ind)            //负责写    a[1]=5


10.函数模版:多种类型可使用同一函数
template<typename T> 函数定义
例:
template<typename T> T 函数名(T a, T b){
    return a<b?a:b;
}
系统会根据多种对应a和b的类型进行编译.
若a和b类型不同,可以使用T1 a, T2 b,此时T1和T2都要在typename中,并且函数返回值类型要对应好.

11.动态内存分配 对类对象调用初始化构造函数或销毁析构函数时,可用new和delete代替malloc和free.
(1)可用于动态分配数组
int n, *p;              //动态生成的内存空间没有名字,需要用指针来接收
p = new int [n];        //生成了长度为变量的一维数组
cin >> p;               //使用cin 指针输入动态分配的数组
delete [] p;            //使用结束后必须手动释放内存

12.自引用、类、接口
class A{                     //class的成员默认private, 而struct的成员默认public
    public:                  //public写在class大括号里边，其后面都public(public的东西是接口)
                             //private:只有自己能用,自己的子类也不能
                             //protected:自己和自己的子类能访问
    int value=1;             //成员变量如不赋初值, 不会默认置零(Java会)
    A& add(int dd){          //&引用
        value = value + dd;
        return *this;        //返回自引用
    }
};                           //类的最后有分号,函数最后没有

int main(){
    A zyy;                   //因为A没有定义任何构造函数, 系统自动生成一个默认构造函数
                             //但如果A中有定义任何一个构造函数, 系统将不再生成默认构造函数.
    zyy.add(2).add(1);       //自引用后add函数可以连续使用
    std::cout<<zyy.value;
    return 0;
}

12.5 继承、多态
class Dirived : public Father {     //通常用public继承, 但默认private继承
public:
    int a;
    Dirived(int b=0,int a=0):Father(b),a     //b是父类的成员变量
    {}
};

多态:
如果不是虚函数(virtual), 默认执行父亲的同名函数.

13.构造函数与析构函数
构造函数 如果有其他构造函数,则必须另写默认构造函数(Java可以不写) 如果一个类没有默认构造函数,则无法构造其对象数组
构造函数初始化列表:
class CExample {       //类名多以C开头
public:
    int a;
    float b;
    CExample(): a(0),b(8.8)    //构造函数初始化列表, 这样做比在构造函数内部赋值要好
    {}                         //这里可以什么都不做
};
析构函数 系统自动生成, 但如果构造时用了new申请了内存空间, 为了防止内存泄漏, 需要手动析构 ~类名
this 是一个指针,使用时不同于Java this->name

14.拷贝构造函数、赋值运算符
硬拷贝(浅拷贝): 管理者拷贝 (默认拷贝构造函数)          //但是如果我们使用了new, 就不能这样管理者拷贝(因此这时候也需要重载赋值运算符, 防止浅拷贝), 会造成内存泄漏, 并且造成重复析构.
深拷贝: 有new出来的东西并且需要拷贝时, 我们就要手写一个新的拷贝构造函数, 在这里面另new一个东西.
拷贝构造函数的写法: 拷贝构造函数也是构造函数, 函数名与类名相同, 且它只有一个参数，该参数就是对一个该类对象的引用, 且没有return语句.
new出来的int可以直接赋值  //存疑


15.在类外定义成员函数
类名::函数名(参数列表)

16.条件编译
(1)if条件编译
#if 0
这部分代码不编译
#else        //可无else
这部分代码编译
#endif
(2)ifdef条件编译 略

17.文件操作
#include <fstream>               //文件操作头文件
#include <iostream>
using namespace std;
int main(){
    ofstream oF("test1.txt");               //创建ofstream类的变量oF,对应文件名test1.txt
    oF << 3.14 << " " << "Hello World\n";   //oF是输出流对象
    oF.close();                             //关闭文件
    ifstream iF("test1.txt");               //同理创建instream类的变量iF
    string str;
    double d;
    iF >> d >> str;                         //从文件输入
    cout << d << str <<endl;
    return 0;
}

18.字符串 string类
string s = "Hello";
s = "apple";                    //可以这样直接修改字符串的值,C语言不可
string s2("world");             //第二种方法赋初值
s.size()==5                     //求串长
s.length()==5                   //求串长
a.substr(0,4)=="hell"           //求从a[0]开始,长度为4的子串
string s3 = s + s2              //字符串用+连接(需要<string>)
s[0] = 'h'                      //可改变串中的单个字符
s.find("llo")==2                //查找子串所在位置的下标
s.insert(3,"ABC")=="helABClo"   //在某位置插入子串
str1.c_str();                   //string转换为C风格字符串，返回char指针
str1.copy(S1,n,pos);            //把str1中从pos开始的n个字符复制到S1字符数组
str1.assign(S1,n);              //将C风格字符串S1开始的n个字符赋值给str1
str1="ABC" , str1="XYZ";        //字符串可进行关系运算
str1 > str2;                    //结果为假
str1 == str2;                   //结果为假
str1 == "ABC";                  //结果为真
b = str1.empty();               //检查字符串是否为空字符串,b为假
str1.erase(3,5);                //从下标3开始往后删5个字符
string student[5]={"Jiang","Cao","Zou","Liu","Wei"}; //定义字符串对象数组且初始化

C++string兼容C语言风格string.h:
(1)字符串复制函数strcpy
char str1[10],str2[]="Computer"; strcpy(str1,str2);            //复制str2到str1
(2)字符串复制函数strncpy
char str1[10], str2[]="Computer"; strncpy(str1,str2,4);        //复制str2的前4个字符到str1
(3)字符串连接函数strcat
char str1[10]="ABC", str2[]="123"; strcat(str1,str2);          //在str1后面连接str2,str2未变化
(4)字符串连接函数strncat
 char str1[10]="ABC",str2[]="123456"; strncat(str1,str2,4);    //将str2前4个字符连接到str1后面
(5)字符串比较函数strcmp
 if (strcmp(str1,str2)==0)......                               //比较字符串相等
 if (strcmp(str1,str2)>0)......                                //比较str1大于str2
(6)计算字符串长度函数
 n=strlen("Language");                                         //n=8
(7)字符串转换成数值函数
double f=atof("123.456");                                      //f=123.456
int i=atoi("-456");                                            //i=-456


19.动态数组vector 长度可以增长 需要头文件<vector> 和std
#include <iostream>
#include <vector>
using namespace std;
int main(){
    vector<int> v;                      //定义一个存放int型的动态数组
    //v[0]=1;                           //不能这样新建元素,但可以这样访问、修改赋值
    v.push_back(1);                     //在尾部添加一个元素
    v.push_back(2);
    v.push_back(3);
    v.pop_back();                       //删除最后一个元素
    v.insert(v.begin(), 4);             // 在数组的开头添加一个元素, 值为4
    for(int i=0;i<v.size();i++){        //v.size()为数组长度
        cout<<v[i]<<endl;
    }
    v.resize(10);                       //改变数组长度 空余的填0
    v.sort(v.begin(),v.end());          //排序, 从v.begin()开始排到v.end()结束, 需要#include <algorithm>
    v.erase(2,3);                       //从v[2]开始,删掉后面三个元素
    v.erase(1);                         //从v[1]开始,删掉后面所有元素
}

20.<iomanip>的使用
#include <iostream>
#include <iomanip>
using namespace std;
int main()
{
    bool v;
    int a, m, n;
    double x, y, z, p, f;
    float f1;
    cin >> boolalpha >> v;                                                      //输入：true                               以布尔类型而不是0/1输入
    cin >> oct >> a >> hex >> m >> dec >> n;                                    //输入：144 46 -77                         八进制、十六进制、十进制
    cin >> p >> f >> f1 >> x >> y >> z;                                         //输入：3.14 3.14 3.14 3.14159 0.1 0.1e1
    cout << v << ' ' << boolalpha << v << ' ' << noboolalpha << v << endl;      //输出：1 true 1
    cout << a << ' ' << p << ' ' << a * p << endl;                              //输出：100 3.14 314
    cout << hex << m << ' ' << oct << m << ' ' << dec << m << endl;             //输出：46 106 70                          以进制数输出
    cout << showbase << hex << m << ' ' << oct << m << ' ' << dec << m << endl; //输出：0x46 0106 70                       输出带进制的数
    cout.precision(5);                                                                                                    输出浮点数
    cout << x << ' ' << y << ' ' << z << endl;               //输出：3.1416 0.1 1
    cout << fixed << x << ' ' << y << ' ' << z << endl;      //输出：3.14159 0.10000 1.00000                               保留五位小数
    cout << scientific << x << ' ' << y << ' ' << z << endl; //输出：3.14159e+00 1.00000e-01 1.00000e+00                   科学计数法形式输出
    cout << left << setw(6) << n << endl;                    //输出：-77_ _ _                                              左对齐,填满6列
    cout.width(6);                                                                                                        宽度为6
    cout << right << n << endl;                                                   //输出：_ _ _-77                         右对齐,填满6列
    cout << setw(10) << 77 << ' ' << setfill('0') << setw(10) << 77 << endl;      //输出：_ _ _ _ _ _ _ _77 0000000077     用0填满10列
    cout << fixed << setprecision(5) << f << ' ' << setprecision(9) << f << endl; //输出：3.14000 3.140000000              保留几位小数
    cout << showpos << 1 << ' ' << 0 << ' ' << -1 << endl;                        //输出：+1 +0 -1                         正数也保留正号
    cout << noshowpos << 1 << ' ' << 0 << ' ' << -1 << endl;                      //输出：1 0 -1
    return 0;
}

21.作用域、全局变量
extern可以将后面定义的实体往前用,前面用的时候加extern,后面定义不加
全局变量作用于整个工程文件夹,但是跨源文件使用也需要extern
static修饰的变量/函数的作用域仅限源文件内,不能extern
函数默认是extern修饰的,但跨文件调用需要重新声明  ---因此可以用包含头文件的方法,免去重新声明
全局变量和static变量,有默认值0

22.数组
sizeof(数组名)          //求数组长度

23.sleep函数 需要<unistd.h>, 对于windows需要<conio.h>
sleep(秒数);            //程序会暂停相应秒数
Sleep(毫秒数);          //对于Windows，这样写

24.随机数生成 srand函数
srand(time(0));        //先生成随机数种子,其中time(0)是1970年至今的秒数,此处不能一秒内运行多次
cout<<rand();          //生成随机数

25.二分法查找(数组已排好序的情况下找数组元素)
int BinarySearch(int A[], int n, int find)
{                                            //二分查找 n=序列元素个数 find=欲查找数据
    int low, upper, mid;
    low = 0, upper = n - 1;                  //左右两部分
    while (low <= upper)
    {
        mid = low + (upper - low) / 2;       //不用(upper+low)/2，避免upper+low溢出
        if (A[mid] < find)
            low = mid + 1;                   //右半部分
        else if (A[mid] > find)
            upper = mid - 1;                 //左半部分
        else
            return mid;                      //找到
    }
    return -1;                               //未找到
}

26.指针
(1)char型指针可以指向字符串(首地址)
char *p = "hello"
*p是'h',p是"hello"
(2)指向函数的指针
返回类型 (*函数指针变量名)(形式参数列表);
例:int (*p)(int a, int b);                   //定义函数指针变量
p = max;                                     //max是某个函数名,max的形参列表也是两个int
p(1,2);                                      //通过指针调用函数

27.宏定义
(1)#运算符:把后面的参数转化为字符串
#define PRINT_MSG1(x) printf(#x);
#define PRINT_MSG2(x) printf(x);
PRINT_MSG1(Hello World);
PRINT_MSG2("Hello World"); //两者输出相同
(2)##运算符:在宏替换下连接两个字符
#define SET1(arg) A##arg=arg;
#define SET2(arg) Aarg=arg;
SET1(1); //宏替换为 A1=1;
SET2(1); //宏替换为 Aarg=1;

28.分支结构
if (条件1) {
    // 条件1为真
} else if (条件2) {
    // 条件2为真
} else {
    // 以上条件都为假
}

```