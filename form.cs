using System.Drawing;
using System.Windows.Forms;

namespace WinFormsApp2
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {

        }

        private void button1_Click(object sender, EventArgs e)
        {
            OpenFileDialog openFileDialog1 = new OpenFileDialog();
            openFileDialog1.Filter = "imágenes JPG|*.jpg| imágenes PNG|*.png";
            openFileDialog1.ShowDialog();

            Bitmap bmp = new Bitmap(openFileDialog1.FileName);
            pictureBox1.Image = bmp;

            // Ajustar el tamaño de la imagen al PictureBox
            pictureBox1.SizeMode = PictureBoxSizeMode.Zoom;
        }

        private void button2_Click(object sender, EventArgs e)
        {
            // Cargar la imagen desde pictureBox1
            Bitmap bmp = new Bitmap(pictureBox1.Image);
            Bitmap bmp2 = new Bitmap(bmp.Width, bmp.Height);

            // Definir un umbral para detectar nieve (ajusta según sea necesario)
            Color snowColor = Color.White; // Color que se considera nieve
            int threshold = 200; // Umbral de brillo para detectar nieve

            for (int i = 0; i < bmp.Width; i++)
            {
                for (int j = 0; j < bmp.Height; j++)
                {
                    Color c = bmp.GetPixel(i, j);
                    // Comprobar si el color es similar al blanco (nieve)
                    if (c.R > threshold && c.G > threshold && c.B > threshold)
                    {
                        bmp2.SetPixel(i, j, Color.Red); // Marcar áreas de nieve en rojo
                    }
                    else
                    {
                        bmp2.SetPixel(i, j, c); // Mantener el color original
                    }
                }
            }

            pictureBox2.Image = bmp2;
            pictureBox2.SizeMode = PictureBoxSizeMode.Zoom;
        }
    }
}