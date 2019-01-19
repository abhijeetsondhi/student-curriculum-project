#include <stdio.h>
#include <time.h>
 
void compare_file(FILE *,FILE *);
 
 /*
 * Main function will check for the validations based on the input provided for executing the code
 */
int main(int argc, char *argv[])
{
    clock_t t,x;
    t = clock(); 
    FILE *fp1, *fp2;
 
    if (argc < 3)
    {
        printf("Please enter 2 files for comparison\n");
        printf("\nHelp:./executable <filename1> <filename2>\n");
        return 0;
    }
    else
    {
        fp1 = fopen(argv[1],  "r");
        if (fp1 == NULL)
        {
            printf("File Error!!%s", argv[1]);
            return 0;
        }
 
        fp2 = fopen(argv[2], "r");
 
        if (fp2 == NULL)
        {
            printf("\nFile Error!!%s", argv[2]);
            return 0;
        }
 
        if ((fp1 != NULL) && (fp2 != NULL))
        {
            compare_file(fp1, fp2);
        }
    }
    x = clock();
     printf("The program took %.3f seconds to execute \n", (double)(x-t)/(1000.0f));
}
 
/*
 * compare two binary files
 */
void compare_file(FILE *fp1, FILE *fp2)
{
    char c1, c2,c3;
    int flag = 0;
 
    while (((c1 = fgetc(fp1)) != EOF) &&((c2 = fgetc(fp2)) != EOF))
    {
        /*
          * here, we are comparing two valid files by each character
          * If difference found, it will be print the offset and set the flag
          */
        if (c1 == c2)
        {
            flag = 1;
            continue;
        }
        /*
          * If not equal then sets the flag and byte position
          */
        else
        {
            fseek(fp1, -1, SEEK_CUR);    
            fseek(fp2, -1, SEEK_CUR);
            flag = 0;
            break;
        }
    }
    /*
    *If file is not equal,the program will print the position at which file is not equal and then it will print 16 bytes from 
    * two files starting from the position which it differs
    */
 
    if (flag == 0)
    {
        printf("Two files are not equal :  byte poistion at which two files differ is %d\n", ftell(fp1)+1);
        printf("First 16 bytes from first file\n");
        for(int i=1;i<=16;i++)
        {
            printf("%c\n",fgetc(fp1));
            
        }
        printf("First 16 bytes from second file\n");
        for(int i=1;i<=16;i++)
        {
            printf("%c\n",fgetc(fp2));
            
        }

    }
    else
    {
        printf("Two files are Equal\n ", ftell(fp1)+1);
    }
}